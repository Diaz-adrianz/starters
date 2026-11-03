import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiUserUnfollowLine } from '@remixicon/react';

type Keys = 'unAssign';

function RoleUserActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
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
