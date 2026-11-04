import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiDeleteBack2Line } from '@remixicon/react';

type Keys = 'delete';

function RolePermissionActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'access-control:role-permission' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { RolePermissionActions };
