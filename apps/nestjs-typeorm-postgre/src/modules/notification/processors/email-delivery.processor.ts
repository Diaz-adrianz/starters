import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Queues } from '../../../lib/queue/default/constants/queues.constant';
import { Job } from 'bullmq';
import { EmailDeliveryJob } from '../../../lib/queue/default/interfaces/email-delivery.interface';
import { LoggerService } from '../../../infra/logger/logger.service';

@Processor(Queues.EMAIL_DELIVERIES, {
  concurrency: 3,
  limiter: { max: 30, duration: 60000 },
})
export class EmailDeliveryProcessor extends WorkerHost {
  constructor(private logger: LoggerService) {
    super();
  }

  async process(job: EmailDeliveryJob): Promise<void> {
    await Promise.resolve();

    switch (job.name) {
      case 'send-transactional-email': {
        const data = job.data;
        console.log(data);
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
