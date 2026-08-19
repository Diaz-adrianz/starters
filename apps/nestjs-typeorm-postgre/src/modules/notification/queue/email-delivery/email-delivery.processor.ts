import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { DefaultMailerService } from '../../../../lib/mailer/default/default-mailer.service';
import {
  EMAIL_DELIVERY_QUEUE,
  EmailDeliveryJob,
} from './email-delivery.config';
import { TemplateService } from '../../resources/template/template.service';
import { Channel } from '../../enums/channel.enum';
import { DeliveryLogStatus } from '../../enums/delivery-log-status.enum';
import { DeliveryService } from '../../resources/delivery/delivery.service';

@Processor(EMAIL_DELIVERY_QUEUE, {
  concurrency: 3,
  limiter: { max: 30, duration: 60000 },
})
export class EmailDeliveryProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    private deliveryService: DeliveryService,
    private templateService: TemplateService,
    private mailerService: DefaultMailerService,
  ) {
    super();
  }

  async process(job: EmailDeliveryJob): Promise<void> {
    switch (job.name) {
      case 'send-to-email': {
        const data = job.data;
        const log = {
          channel: Channel.EMAIL,
          recipient: data.email,
          attemptsCount: job.attemptsMade,
        };
        const isLastAttempt = log.attemptsCount + 1 >= (job.opts.attempts ?? 1);

        await this.deliveryService.upsertLog(data.deliveryId, {
          ...log,
          status:
            log.attemptsCount === 0
              ? DeliveryLogStatus.PENDING
              : DeliveryLogStatus.RETRYING,
        });

        const template = await this.templateService
          .render(data.templateKey, Channel.EMAIL, data.payload)
          .catch(async (e: Error) => {
            await this.deliveryService.upsertLog(data.deliveryId, {
              ...log,
              status: DeliveryLogStatus.FAILED,
              statusMessage: `Template render error: ${e.message}`,
            });
            return null;
          });
        if (!template) return;

        try {
          await this.mailerService.send(
            data.email,
            template.title,
            template.body,
            {
              sender: data.sender,
              replyTo: data.replyTo,
            },
          );

          await this.deliveryService.upsertLog(data.deliveryId, {
            ...log,
            status: DeliveryLogStatus.SENT,
            statusMessage: '',
            sentAt: new Date(),
            payload: template.maskedPayload,
          });
        } catch (e) {
          if (isLastAttempt) {
            await this.deliveryService.upsertLog(data.deliveryId, {
              ...log,
              status: DeliveryLogStatus.FAILED,
              statusMessage: `Delivery error: ${(e as Error)?.message}`,
              attemptsCount: log.attemptsCount + 1,
            });
          }
          throw e;
        }
        break;
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[${job.queueName}] job ${job.name} (${job.id}) completed`,
      this.constructor.name,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    // TODO: send dev alert event after reached max attempts
    this.logger.error(
      `[${job.queueName}] job ${job.name} (${job.id}) failed after ${job.attemptsMade} attempt(s): ${err.message}`,
      this.constructor.name,
    );
  }
}
