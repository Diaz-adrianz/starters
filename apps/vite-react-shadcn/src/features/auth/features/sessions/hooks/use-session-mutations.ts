import { useConfirm } from '@/components/shared/confirm';
import { toast } from 'sonner';
import { useDeleteSession, useRevokeSession } from '../api/session.mutation';
import type { Session } from '../types/session.type';

function useSessionMutations() {
  const confirm = useConfirm();

  const deleteApi = useDeleteSession(),
    revokeApi = useRevokeSession();

  const revoke = async (session: Pick<Session, 'id' | 'deviceLabel'>) => {
    const ok = await confirm({
      title: 'Terminate session?',
      description: `"${session.deviceLabel || 'Unknown'}" will be signed out and must sign in again.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(revokeApi.mutateAsync({ id: session.id }), {
        loading: 'Terminating session...',
        success: 'Session terminated',
      });
  };

  const del = async (session: Pick<Session, 'id' | 'deviceLabel'>) => {
    const ok = await confirm({
      title: 'Delete session?',
      description: `Delete "${session.deviceLabel || 'Unknown'}"? This cannot be undone.`,
      confirmVariant: 'destructive',
    });
    if (ok)
      toast.promise(deleteApi.mutateAsync(session.id), {
        loading: 'Deleting session...',
        success: 'Session deleted',
      });
  };

  return { revoke, del };
}

export { useSessionMutations };
