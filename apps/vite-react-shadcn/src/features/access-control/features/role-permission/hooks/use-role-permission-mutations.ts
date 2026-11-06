import { useConfirm } from '@/components/shared/confirm';
import { useDeleteRolePermission } from '../api/role-permission.mutation';
import { toast } from 'sonner';

function useRolePermissionMutations() {
  const confirm = useConfirm();

  const deleteApi = useDeleteRolePermission();

  const del = async (item: {
    id: string;
    roleName: string;
    permissionDesc: string;
  }) => {
    const ok = await confirm({
      title: 'Revoke permission?',
      description: `"${item.roleName}" will lose "${item.permissionDesc}". Users with this role may immediately lose access.`,
      confirmText: 'Revoke',
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(deleteApi.mutateAsync(item.id), {
        loading: 'Revoking permission...',
        success: `Revoked "${item.permissionDesc}" from "${item.roleName}"`,
      });
  };

  return { del };
}

export { useRolePermissionMutations };
