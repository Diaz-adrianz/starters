import { Job, JobsOptions, Queue } from 'bullmq';
import { PushProvider } from '../../enums/push-provider.enum';

export const PUSH_DELIVERY_QUEUE = 'push-deliveries';

export const PushDeliveryJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 3000 },
};

export const PushDeliveryJobNames = {
  SEND_TO_USER: 'send-to-user',
} as const;

export type PushDeliveryJobName =
  (typeof PushDeliveryJobNames)[keyof typeof PushDeliveryJobNames];

export interface PushDeliveryJobPayload {
  [PushDeliveryJobNames.SEND_TO_USER]: {
    deliveryId: string;
    userId: string;
    templateKey: string;
    payload: Record<string, any>;
    pushTokens?: { token: string; provider: PushProvider }[];
    stats?: {
      sent?: number;
      total?: number;
      revoked?: number;
    };
  };
}

export type PushDeliveryQueue = Queue<
  PushDeliveryJobPayload[keyof PushDeliveryJobPayload],
  void,
  PushDeliveryJobName
>;

export type PushDeliveryJob = Job<
  PushDeliveryJobPayload[keyof PushDeliveryJobPayload],
  void,
  PushDeliveryJobName
>;
