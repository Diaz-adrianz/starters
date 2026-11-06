import {
  ResourceActions,
  type ResourceActionsProps,
} from '@/components/shared/resource-actions';
import { RiExpandDiagonalLine } from '@remixicon/react';

type Keys = 'view';

function ActivityActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'audit:activity' },
        },
      }}
      {...props}
    />
  );
}

export { ActivityActions };
