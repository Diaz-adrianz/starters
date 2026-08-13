import { Job, Queue } from 'bullmq';

export const EmailDeliveryJobNames = {
  SEND_TRANSACTIONAL_EMAIL: 'send-transactional-email',
} as const;

export type EmailDeliveryJobName =
  (typeof EmailDeliveryJobNames)[keyof typeof EmailDeliveryJobNames];

export interface EmailDeliveryJobPayload {
  [EmailDeliveryJobNames.SEND_TRANSACTIONAL_EMAIL]: {
    to: string;
    template: string;
    data: Record<string, unknown>;
  };
}

export type EmailDeliveryQueue = Queue<
  EmailDeliveryJobPayload[keyof EmailDeliveryJobPayload],
  void,
  EmailDeliveryJobName
>;

export type EmailDeliveryJob = Job<
  EmailDeliveryJobPayload[keyof EmailDeliveryJobPayload],
  void,
  EmailDeliveryJobName
>;
