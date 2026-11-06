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

function ProfileActions(
  props: Omit<ResourceActionsProps<Keys>, 'keys' | 'actions'>
) {
  return (
    <ResourceActions<Keys>
      actions={{
        view: {
          icon: RiExpandDiagonalLine,
          label: 'View',
          can: { i: 'read', a: 'identity:profile' },
        },
        edit: {
          icon: RiEdit2Line,
          label: 'Edit',
          can: { i: 'update', a: 'identity:profile' },
        },
        remove: {
          icon: RiDeleteBinLine,
          label: 'Remove',
          can: { i: 'archive', a: 'identity:profile' },
          variant: 'destructive',
        },
        resendInvite: {
          icon: RiMailSendLine,
          label: 'Resend invite',
          can: { i: 'invite', a: 'identity:profile' },
        },
        restore: {
          icon: RiArrowGoBackLine,
          label: 'Restore',
          can: { i: 'restore', a: 'identity:profile' },
        },
        delete: {
          icon: RiDeleteBack2Line,
          label: 'Delete',
          can: { i: 'delete', a: 'identity:profile' },
          variant: 'destructive',
        },
      }}
      {...props}
    />
  );
}

export { ProfileActions };
