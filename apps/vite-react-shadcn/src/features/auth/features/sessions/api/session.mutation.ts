import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionApi } from './session.api';
import { queryKeys } from './session.query';

export function useRemoveSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SessionApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => SessionApi.revoke(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
