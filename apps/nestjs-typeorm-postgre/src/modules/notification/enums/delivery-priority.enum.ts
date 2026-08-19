export enum DeliveryPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export const DeliveryPriorityWeight: Record<DeliveryPriority, number> = {
  [DeliveryPriority.CRITICAL]: 1,
  [DeliveryPriority.HIGH]: 2,
  [DeliveryPriority.NORMAL]: 3,
  [DeliveryPriority.LOW]: 4,
};
