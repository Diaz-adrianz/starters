import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import {
  RiDeleteBack2Line,
  RiExpandDiagonalLine,
  RiProhibitedLine,
} from '@remixicon/react';

type Keys = 'view' | 'delete' | 'revoke';

function SessionActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'auth:session' },
        },
        revoke: {
          icon: RiProhibitedLine,
          label: 'Terminate',
          can: { i: 'revoke', a: 'auth:session' },
          variant: 'destructive',
        },
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'auth:session' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { SessionActions };
