import { useConfirm } from '@/components/shared/confirm';
import {
  useArchiveUser,
  useDeleteUser,
  useRestoreUser,
} from '../api/user.mutation';
import type { User } from '../types/user.type';
import { toast } from 'sonner';

function useUserMutations() {
  const confirm = useConfirm();

  const archiveApi = useArchiveUser(),
    restoreApi = useRestoreUser(),
    deleteApi = useDeleteUser();

  const archive = async (user: Pick<User, 'id' | 'username'>) => {
    const ok = await confirm({
      title: 'Remove user?',
      description: `Remove "${user.username}"? You can restore it later.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(archiveApi.mutateAsync({ id: user.id }), {
        loading: 'Removing user...',
        success: 'User removed',
      });
  };

  const restore = async (user: Pick<User, 'id' | 'username'>) => {
    const ok = await confirm({
      title: 'Restore user?',
      description: `Restore "${user.username}"? It will be active again.`,
    });
    if (ok)
      toast.promise(restoreApi.mutateAsync({ id: user.id }), {
        loading: 'Restoring user...',
        success: 'User restored',
      });
  };

  const del = async (user: Pick<User, 'id' | 'username'>) => {
    const ok = await confirm({
      title: 'Delete user?',
      description: `Delete "${user.username}"? This cannot be undone.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(deleteApi.mutateAsync(user.id), {
        loading: 'Deleting user...',
        success: 'User deleted',
      });
  };

  return { archive, restore, del };
}

export { useUserMutations };
