import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionApi } from './session.api';
import { queryKeys } from './session.query';

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SessionApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => SessionApi.revoke(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}
