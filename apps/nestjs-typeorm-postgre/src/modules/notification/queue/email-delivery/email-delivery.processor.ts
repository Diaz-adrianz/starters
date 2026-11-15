import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { UnrecoverableError } from 'bullmq';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { DefaultMailerService } from '../../../../lib/mailer/default/default-mailer.service';
import {
  EMAIL_DELIVERY_QUEUE,
  type EmailDeliveryJob,
} from './email-delivery.config';
import { TemplateService } from '../../resources/template/template.service';
import { Channel } from '../../enums/channel.enum';
import { maskEmailString } from '../../../../shared/utils/string.util';

@Processor(EMAIL_DELIVERY_QUEUE, {
  concurrency: 3,
  limiter: { max: 30, duration: 60000 },
})
export class EmailDeliveryProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    private templateService: TemplateService,
    private mailerService: DefaultMailerService,
  ) {
    super();
  }

  async process(job: EmailDeliveryJob): Promise<void> {
    switch (job.name) {
      case 'send-to-email': {
        const data = job.data;

        let template: Awaited<ReturnType<TemplateService['render']>>;
        try {
          template = await this.templateService.render(
            data.templateKey,
            Channel.EMAIL,
            data.payload,
          );
        } catch (e) {
          throw new UnrecoverableError(
            `Template render failed: ${(e as Error).message}`,
          );
        }

        await this.mailerService.send(
          data.email,
          template.title,
          template.body,
          { sender: data.sender, replyTo: data.replyTo },
        );

        this.logger.log(
          `[${job.queueName}] delivery ${data.deliveryId} email sent to ${maskEmailString(data.email)} (attempt ${job.attemptsMade + 1})`,
          this.constructor.name,
        );
        break;
      }
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: EmailDeliveryJob, err: Error) {
    switch (job.name) {
      case 'send-to-email':
        this.logger.error(
          `[${job.queueName}] delivery ${job.data.deliveryId} to ${maskEmailString(job.data.email)} failed after ${job.attemptsMade} attempts: `,
          err,
          this.constructor.name,
        );
        break;
    }
  }
}
