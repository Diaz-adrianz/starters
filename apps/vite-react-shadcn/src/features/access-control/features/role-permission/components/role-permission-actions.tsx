import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiDeleteBack2Line, RiExpandDiagonalLine } from '@remixicon/react';

type Keys = 'view' | 'delete';

function RolePermissionActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'access-control:role-permission' },
        },
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
