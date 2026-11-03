import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiAccountCircleLine, RiUserUnfollowLine } from '@remixicon/react';

type Keys = 'viewUser' | 'unAssign';

function RoleUserActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        viewUser: {
          icon: RiAccountCircleLine,
          label: 'View account',
          can: { i: 'read', a: 'identity:user' },
        },
        unAssign: {
          icon: RiUserUnfollowLine,
          label: 'Unassign',
          can: { i: 'update', a: 'access-control:role' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { RoleUserActions };
