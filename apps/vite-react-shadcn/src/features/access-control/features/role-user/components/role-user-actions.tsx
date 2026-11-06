import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiAccountCircleLine, RiDeleteBack2Line } from '@remixicon/react';

type Keys = 'viewUser' | 'delete';

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
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'access-control:role-user' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { RoleUserActions };
