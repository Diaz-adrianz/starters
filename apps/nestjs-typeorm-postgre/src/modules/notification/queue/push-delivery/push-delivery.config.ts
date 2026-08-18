import { Job, Queue } from 'bullmq';

export const PUSH_DELIVERY_QUEUE = 'push-deliveries';

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
