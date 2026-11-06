import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiEdit2Line } from '@remixicon/react';

type Keys = 'edit';

function PermissionActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        edit: {
          icon: RiEdit2Line,
          label: 'Edit',
          can: { i: 'update', a: 'access-control:permission' },
        },
      }}
      {...props}
    />
  );
}

export { PermissionActions };
