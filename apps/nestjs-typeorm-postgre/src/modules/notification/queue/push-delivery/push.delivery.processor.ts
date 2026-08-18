import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PUSH_DELIVERY_QUEUE, PushDeliveryJob } from './push-delivery.config';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { DefaultFirebaseService } from '../../../../lib/firebase/default/default-firebase.service';
import { TemplateService } from '../../resources/template/template.service';
import { Channel } from '../../enums/channel.enum';
import { PushProvider } from '../../enums/push-provider.enum';
import { chunk } from '../../../../shared/utils/array.util';
import { DeliveryLog } from '../../entities/delivery-log.entity';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DeliveryLogStatus } from '../../enums/delivery-log-status.enum';
import { In } from 'typeorm';

@Processor(PUSH_DELIVERY_QUEUE, { concurrency: 5 })
export class PushDeliveryProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    @InjectRepository(DeliveryLog, DatabaseKeys.DEFAULT)
    private deliveryLogRepo: AppRepository<DeliveryLog>,
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: AppRepository<PushToken>,
    private templateService: TemplateService,
    private firebaseService: DefaultFirebaseService,
  ) {
    super();
  }

  async process(job: PushDeliveryJob): Promise<void> {
    switch (job.name) {
      case 'send-to-user': {
        const data = job.data;

        let status = DeliveryLogStatus.SENT,
          message = '';

        // render template
        const template = await this.templateService
          .render(data.templateKey, Channel.PUSH, data.payload)
          .catch((e: Error) => {
            status = DeliveryLogStatus.FAILED;
            message = `Template render error: ${e.message}`;
            return null;
          });

        if (template) {
          // find active user tokens
          const pushTokens = await this.pushTokenRepo.findBy({
            userId: data.userId,
            enabled: true,
          });

          if (!pushTokens.length) {
            status = DeliveryLogStatus.FAILED;
            message = 'User does not have any active tokens';
          } else {
            // filter FCM providers
            const fcmTokens = pushTokens
              .filter((upt) => upt.provider == PushProvider.FCM)
              .map((upt) => upt.token);

            // providers handler: FCM & ...
            const [fcmResult] = await Promise.allSettled([
              this.sendFirebaseMessage(
                fcmTokens,
                template.title,
                template.body,
              ),
            ]);

            let sent = 0,
              failed = 0;
            const brokenTokens: string[] = [];

            // evaluate providers result
            if (fcmResult.status == 'fulfilled') {
              sent += fcmResult.value.sent;
              failed += fcmResult.value.failed;
              brokenTokens.push(...fcmResult.value.brokenTokens);
            }

            // at-least-once token sent
            if (sent >= 1) {
              status = DeliveryLogStatus.SENT;
              message = `${sent}/${sent + failed} tokens sent`;
            } else {
              status = DeliveryLogStatus.FAILED;
              message = 'All tokens failed';
            }

            // revoke broken tokens
            if (brokenTokens.length)
              await this.pushTokenRepo.update(
                { token: In(brokenTokens) },
                { enabled: false },
              );
          }
        }

        // save deliver log
        await this.deliveryLogRepo.upsert(
          {
            deliveryId: data.deliveryId,
            channel: Channel.PUSH,
            recipient: data.userId,
            status: status,
            statusMessage: message,
            sentAt: status === DeliveryLogStatus.SENT ? new Date() : null,
            payload: template?.maskedPayload,
          },
          { conflictPaths: ['deliveryId', 'channel', 'recipient'] },
        );

        break;
      }
    }
  }

  // ================================================================
  // Provider deliveries
  // ----------------------------------------------------------------
  private async sendFirebaseMessage(
    tokens: string[],
    title: string,
    body: string,
  ) {
    let sent = 0,
      failed = 0;
    const brokenTokens: string[] = [];

    const tokenChunks = tokens.length > 500 ? chunk(tokens, 500) : [tokens];

    for (const tokenChunk of tokenChunks) {
      const result = await this.firebaseService.sendManyNofitication(
        tokenChunk,
        title,
        body,
      );
      result.responses.forEach((res, i) => {
        if (res.success) {
          sent += 1;
        } else {
          failed += 1;
          if (
            [
              'messaging/invalid-registration-token',
              'messaging/registration-token-not-registered',
            ].includes(res.error?.code ?? '')
          ) {
            brokenTokens.push(tokenChunk[i]);
          }
        }
      });
    }

    return { sent, failed, brokenTokens };
  }

  // ================================================================
  // Listener
  // ----------------------------------------------------------------
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[${job.queueName}] job ${job.name} (${job.id}) completed`,
      this.constructor.name,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `[${job.queueName}] job ${job.name} (${job.id}) failed after ${job.attemptsMade} attempt(s): ${err.message}`,
      this.constructor.name,
    );
  }
}
