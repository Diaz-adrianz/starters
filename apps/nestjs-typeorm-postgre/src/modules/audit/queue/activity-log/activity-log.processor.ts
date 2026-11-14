import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ACTIVITY_LOG_QUEUE, ActivityLogJob } from './activity-log.config';
import { ActivityService } from '../../resources/activity/activity.service';
import { Job } from 'bullmq';

@Processor(ACTIVITY_LOG_QUEUE, { concurrency: 2 })
export class ActivityLogProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    private activityService: ActivityService,
  ) {
    super();
  }

  async process(job: ActivityLogJob): Promise<void> {
    const entries = job.data.entries.map((e) => ({
      ...e,
      occuredAt: new Date(e.occuredAt),
    }));

    await this.activityService.createMany(entries);

    this.logger.debug(
      `Wrote ${entries.length} activities`,
      this.constructor.name,
    );
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
      `[${job.queueName}] job ${job.name} (${job.id}) failed after ${job.attemptsMade} attempt(s): `,
      err,
      this.constructor.name,
    );
  }
}
