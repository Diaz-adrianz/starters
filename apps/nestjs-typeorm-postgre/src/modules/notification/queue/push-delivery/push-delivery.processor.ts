import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { UnrecoverableError } from 'bullmq';
import {
  PUSH_DELIVERY_QUEUE,
  type PushDeliveryJob,
} from './push-delivery.config';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { DefaultFirebaseService } from '../../../../lib/firebase/default/default-firebase.service';
import { TemplateService } from '../../resources/template/template.service';
import { Channel } from '../../enums/channel.enum';
import { PushProvider } from '../../enums/push-provider.enum';
import { chunk } from '../../../../shared/utils/array.util';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { In, Repository } from 'typeorm';

interface SendMessageResult {
  sent: number;
  revokedTokens: string[];
  retryableTokens: string[];
}

@Processor(PUSH_DELIVERY_QUEUE, { concurrency: 5 })
export class PushDeliveryProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: Repository<PushToken>,
    private templateService: TemplateService,
    private firebaseService: DefaultFirebaseService,
  ) {
    super();
  }

  async process(job: PushDeliveryJob): Promise<void> {
    switch (job.name) {
      case 'send-to-user': {
        const data = job.data;
        const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
        const tag = `delivery ${data.deliveryId} user ${data.userId}`;

        let template: Awaited<ReturnType<TemplateService['render']>>;
        try {
          template = await this.templateService.render(
            data.templateKey,
            Channel.PUSH,
            data.payload,
          );
        } catch (e) {
          throw new UnrecoverableError(
            `Template render error: ${(e as Error).message}`,
          );
        }

        let pushTokens = data.pushTokens;
        if (!pushTokens) {
          const tokens = await this.pushTokenRepo.findBy({
            userId: data.userId,
            enabled: true,
          });
          pushTokens = tokens.map((t) => ({
            token: t.token,
            provider: t.provider,
          }));
        }

        if (!pushTokens.length)
          throw new UnrecoverableError('User does not have any active tokens');

        const tokensByProvider = new Map<PushProvider, string[]>();

        for (const { provider, token } of pushTokens) {
          const tokens = tokensByProvider.get(provider) ?? [];
          tokens.push(token);
          tokensByProvider.set(provider, tokens);
        }

        const providerResults = await Promise.allSettled(
          [...tokensByProvider].map(([provider, tokens]) =>
            this.sendMessageByProvider(
              provider,
              tokens,
              template.title,
              template.body,
            ),
          ),
        );

        let sent = 0;
        const revoked: string[] = [];
        const retryable: { token: string; provider: PushProvider }[] = [];

        [...tokensByProvider].forEach(([provider, tokens], i) => {
          const result = providerResults[i];
          if (result.status === 'fulfilled') {
            sent += result.value.sent;
            revoked.push(...result.value.revokedTokens);
            retryable.push(
              ...result.value.retryableTokens.map((token) => ({
                token,
                provider,
              })),
            );
          } else {
            this.logger.error(
              `${tag} provider ${provider} failed: `,
              result.reason,
              this.constructor.name,
            );
            retryable.push(...tokens.map((token) => ({ token, provider })));
          }
        });

        if (revoked.length)
          await this.pushTokenRepo.update(
            { token: In(revoked) },
            { enabled: false },
          );

        const stats = {
          sent: (data.stats?.sent ?? 0) + sent,
          total: data.stats?.total ?? pushTokens.length,
          revoked: (data.stats?.revoked ?? 0) + revoked.length,
        };

        if (retryable.length && !isLastAttempt) {
          await job.updateData({ ...data, pushTokens: retryable, stats });
          this.logger.log(
            `${tag} ${stats.sent}/${stats.total} sent, ${stats.revoked} revoked, ${retryable.length} pending retry`,
            this.constructor.name,
          );
          throw new Error(`${retryable.length} tokens pending retry`);
        }

        if (stats.sent >= 1) {
          this.logger.log(
            `${tag} ${stats.sent}/${stats.total} tokens sent, ${stats.revoked} revoked`,
            this.constructor.name,
          );
          break;
        }

        throw new UnrecoverableError(
          stats.revoked === stats.total
            ? 'All tokens revoked'
            : `All ${stats.total} tokens failed across attempts`,
        );
      }
    }
  }

  // Provider deliveries
  // ----------------------------------------------------------------
  private async sendMessageByProvider(
    provider: PushProvider,
    tokens: string[],
    title: string,
    body: string,
  ): Promise<SendMessageResult> {
    switch (provider) {
      case PushProvider.FCM:
        return this.sendFirebaseMessage(tokens, title, body);
      default:
        throw new Error(`Unsupported push provider: ${String(provider)}`);
    }
  }

  private async sendFirebaseMessage(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<SendMessageResult> {
    let sent = 0;
    const revokedTokens: string[] = [];
    const retryableTokens: string[] = [];

    const tokenChunks = tokens.length > 500 ? chunk(tokens, 500) : [tokens];

    const REVOKE_CODES = [
      'messaging/invalid-registration-token',
      'messaging/registration-token-not-registered',
    ];

    for (const tokenChunk of tokenChunks) {
      const result = await this.firebaseService.sendManyNofitication(
        tokenChunk,
        title,
        body,
      );
      result.responses.forEach((res, i) => {
        if (res.success) sent += 1;
        else if (REVOKE_CODES.includes(res.error?.code ?? ''))
          revokedTokens.push(tokenChunk[i]);
        else retryableTokens.push(tokenChunk[i]);
      });
    }

    return { sent, revokedTokens, retryableTokens };
  }

  // Listener
  // ----------------------------------------------------------------
  @OnWorkerEvent('failed')
  onFailed(job: PushDeliveryJob, err: Error) {
    switch (job.name) {
      case 'send-to-user':
        this.logger.error(
          `Delivery ${job.data.deliveryId} to user ${job.data.userId} failed after ${job.attemptsMade} attempts`,
          err,
          this.constructor.name,
        );
        break;
    }
  }
}
