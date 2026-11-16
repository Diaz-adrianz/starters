import { Job, JobsOptions, Queue } from 'bullmq';
import { AuditEventPayload } from '../../../../infra/event/interfaces/audit-event.interface';

export const ACTIVITY_LOG_QUEUE = 'activity-logs';

export const ActivityLogJobOptions: JobsOptions = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: { count: 5000 },
};

export const ActivityLogJobNames = {
  WRITE_BATCH: 'write-batch',
} as const;

export type ActivityLogJobName =
  (typeof ActivityLogJobNames)[keyof typeof ActivityLogJobNames];

export interface ActivityLogJobPayload {
  [ActivityLogJobNames.WRITE_BATCH]: {
    entries: AuditEventPayload['audit.activity.log'][];
  };
}

export type ActivityLogQueue = Queue<
  ActivityLogJobPayload[keyof ActivityLogJobPayload],
  void,
  ActivityLogJobName
>;

export type ActivityLogJob = Job<
  ActivityLogJobPayload[keyof ActivityLogJobPayload],
  void,
  ActivityLogJobName
>;
