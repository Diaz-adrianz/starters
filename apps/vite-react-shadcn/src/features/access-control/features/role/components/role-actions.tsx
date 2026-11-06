import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import {
  RiArrowGoBackLine,
  RiDeleteBack2Line,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExpandDiagonalLine,
} from '@remixicon/react';

type Keys = 'view' | 'edit' | 'remove' | 'restore' | 'delete';

function RoleActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'access-control:role' },
        },
        edit: {
          icon: RiEdit2Line,
          label: 'Edit',
          can: { i: 'update', a: 'access-control:role' },
        },
        remove: {
          icon: RiDeleteBinLine,
          label: 'Remove',
          can: { i: 'archive', a: 'access-control:role' },
          variant: 'destructive',
        },
        restore: {
          icon: RiArrowGoBackLine,
          label: 'Restore',
          can: { i: 'restore', a: 'access-control:role' },
        },
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'access-control:role' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { RoleActions };
