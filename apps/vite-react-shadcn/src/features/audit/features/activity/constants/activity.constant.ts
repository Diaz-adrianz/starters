import type { Option } from '@/utils/option';
import type { ActivityOutcome } from '../types/activity.type';

export const ActivityOutcomeMap: Record<
  ActivityOutcome,
  Option<ActivityOutcome, { className: string }>
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
} as const;

export const ActivityOutcomeOptions = Object.values(ActivityOutcomeMap);
