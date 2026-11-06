import type { Option } from '@/utils/option';
import type { ActivityActorType, ActivityStatus } from '../types/activity.type';

export const ActivityActorTypeMap: Record<
  ActivityActorType,
  Option<ActivityActorType>
> = {
  user: { value: 'user', label: 'Account' },
} as const;

export const ActivityActorTypeOptions = Object.values(ActivityActorTypeMap);

export const ActivityStatusMap: Record<
  ActivityStatus,
  Option<ActivityStatus, { className: string }>
> = {
  success: {
    value: 'success',
    label: 'Success',
    meta: { className: 'text-green-500' },
  },
  failure: {
    value: 'failure',
    label: 'Failure',
    meta: { className: 'text-red-500' },
  },
  denied: {
    value: 'denied',
    label: 'Denied',
    meta: { className: 'text-yellow-500' },
  },
} as const;

export const ActivityStatusOptions = Object.values(ActivityStatusMap);
