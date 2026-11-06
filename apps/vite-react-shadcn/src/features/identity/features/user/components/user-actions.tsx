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
  RiMailSendLine,
} from '@remixicon/react';

type Keys = 'view' | 'edit' | 'remove' | 'restore' | 'delete' | 'resendInvite';

function UserActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'identity:user' },
        },
        edit: {
          icon: RiEdit2Line,
          label: 'Edit',
          can: { i: 'update', a: 'identity:user' },
        },
        remove: {
          icon: RiDeleteBinLine,
          label: 'Remove',
          can: { i: 'archive', a: 'identity:user' },
          variant: 'destructive',
        },
        resendInvite: {
          icon: RiMailSendLine,
          label: 'Resend invite',
          can: { i: 'invite', a: 'identity:user' },
        },
        restore: {
          icon: RiArrowGoBackLine,
          label: 'Restore',
          can: { i: 'restore', a: 'identity:user' },
        },
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'identity:user' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { UserActions };
