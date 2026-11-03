import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiProhibitedLine } from '@remixicon/react';

type Keys = 'revoke';

function RolePermissionActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        revoke: {
          icon: RiProhibitedLine,
          label: 'Revoke',
          can: { i: 'update', a: 'access-control:role' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { RolePermissionActions };
