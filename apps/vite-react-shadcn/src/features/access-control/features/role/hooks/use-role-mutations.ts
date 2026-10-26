import { useConfirm } from '@/components/shared/confirm';
import {
  useArchiveRole,
  useDeleteRole,
  useRestoreRole,
} from '../api/role.mutation';
import type { Role } from '../types/role.type';
import { toast } from 'sonner';

function useRoleMutations() {
  const confirm = useConfirm();

  const archiveApi = useArchiveRole(),
    restoreApi = useRestoreRole(),
    deleteApi = useDeleteRole();

  const archive = async (role: Pick<Role, 'id' | 'name'>) => {
    const ok = await confirm({
      title: 'Remove role?',
      description: `Remove "${role.name}"? You can restore it later.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(archiveApi.mutateAsync({ id: role.id }), {
        loading: 'Removing role...',
        success: 'Role removed',
      });
  };

  const restore = async (role: Pick<Role, 'id' | 'name'>) => {
    const ok = await confirm({
      title: 'Restore role?',
      description: `Restore "${role.name}"? It will be active again.`,
    });
    if (ok)
      toast.promise(restoreApi.mutateAsync({ id: role.id }), {
        loading: 'Restoring role...',
        success: 'Role restored',
      });
  };

  const del = async (role: Pick<Role, 'id' | 'name'>) => {
    const ok = await confirm({
      title: 'Delete role?',
      description: `Delete "${role.name}"? This cannot be undone.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(deleteApi.mutateAsync(role.id), {
        loading: 'Deleting role...',
        success: 'Role deleted',
      });
  };

  return { archive, restore, del };
}

export { useRoleMutations };
