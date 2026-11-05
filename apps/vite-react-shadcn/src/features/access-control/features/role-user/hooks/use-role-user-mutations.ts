import { useConfirm } from '@/components/shared/confirm';
import { useDeleteRoleUser } from '../api/role-user.mutation';
import type { RoleUser } from '../types/role-user.type';
import { toast } from 'sonner';

function useRoleUserMutations() {
  const confirm = useConfirm();

  const deleteApi = useDeleteRoleUser();

  const del = async (
    roleUser: Pick<RoleUser, 'id' | 'username'> & { roleName?: string }
  ) => {
    const ok = await confirm({
      title: 'Unassign role?',
      description: `${roleUser.username} will lose "${roleUser.roleName ?? 'this role'}" and the permissions it grants.`,
      confirmText: 'Unassign',
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(deleteApi.mutateAsync(roleUser.id), {
        loading: 'Unassigning role...',
        success: `Role unassigned from ${roleUser.username}`,
      });
  };

  return { del };
}

export { useRoleUserMutations };
