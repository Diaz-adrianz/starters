import type { Option } from '@/utils/option';
import type { UserStatus } from '../types/user.type';
import type { badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

export const UserStatusMap: Record<
  UserStatus,
  Option<
    UserStatus,
    { badgeVariant: VariantProps<typeof badgeVariants>['variant'] }
  >
> = {
  invited: {
    value: 'invited',
    label: 'Invited',
    meta: { badgeVariant: 'outline' },
  },
  active: {
    value: 'active',
    label: 'Active',
    meta: { badgeVariant: 'default' },
  },
  disabled: {
    value: 'disabled',
    label: 'Disabled',
    meta: { badgeVariant: 'destructive' },
  },
} as const;

export const UserStatusOptions = Object.values(UserStatusMap);

export const UserStatuss = Object.keys(UserStatusMap);
