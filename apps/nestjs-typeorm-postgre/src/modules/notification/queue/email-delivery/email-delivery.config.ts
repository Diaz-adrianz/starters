import { Job, JobsOptions, Queue } from 'bullmq';

export const EMAIL_DELIVERY_QUEUE = 'email-deliveries';

export const EmailDeliveryJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
};

export const EmailDeliveryJobNames = {
  SEND_TO_EMAIL: 'send-to-email',
} as const;

export type EmailDeliveryJobName =
  (typeof EmailDeliveryJobNames)[keyof typeof EmailDeliveryJobNames];

export interface EmailDeliveryJobPayload {
  [EmailDeliveryJobNames.SEND_TO_EMAIL]: {
    deliveryId: string;
    email: string;
    templateKey: string;
    payload: Record<string, unknown>;
    from?: string;
    replyTo?: string;
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
