import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { DefaultMailerService } from '../../../../lib/mailer/default/default-mailer.service';
import {
  EMAIL_DELIVERY_QUEUE,
  EmailDeliveryJob,
} from './email-delivery.config';

@Processor(EMAIL_DELIVERY_QUEUE, {
  concurrency: 3,
})
export class EmailDeliveryProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    private mailerService: DefaultMailerService,
  ) {
    super();
  }

  async process(job: EmailDeliveryJob): Promise<void> {
    switch (job.name) {
      case 'send-transactional-email': {
        const data = job.data;
        await this.mailerService.send({
          to: data.to,
          subject: data.subject,
          content: { fileName: data.template, payload: data.payload },
        });
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
    this.logger.error(
      `[${job.queueName}] job ${job.name} (${job.id}) failed after ${job.attemptsMade} attempt(s): ${err.message}`,
      this.constructor.name,
    );
  }
}
