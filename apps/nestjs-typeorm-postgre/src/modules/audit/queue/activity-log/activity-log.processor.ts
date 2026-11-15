import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ACTIVITY_LOG_QUEUE, type ActivityLogJob } from './activity-log.config';
import { ActivityService } from '../../resources/activity/activity.service';
import { UnrecoverableError } from 'bullmq';

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

  @OnWorkerEvent('failed')
  onFailed(job: ActivityLogJob, err: Error) {
    const final =
      job.attemptsMade >= (job.opts.attempts ?? 1) ||
      err instanceof UnrecoverableError;

    if (!final) {
      this.logger.warn(
        `[${job.queueName}] job ${job.id} failed, attempt ${job.attemptsMade}, retrying: ${err.message}`,
        this.constructor.name,
      );
      return;
    }

    this.logger.error(
      `[${job.queueName}] job ${job.id} DEAD: ${job.data.entries.length} audit entries not saved after ${job.attemptsMade} attempt(s): `,
      err,
      this.constructor.name,
    );
  }
}
