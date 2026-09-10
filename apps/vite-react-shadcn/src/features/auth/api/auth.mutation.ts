import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from './auth.api';
import { queryKeys } from './auth.query';

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AuthApi.signIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useSignOut({
  silent,
  onSuccess,
}: { silent?: boolean; onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AuthApi.signOut,
    meta: { silent },
    onSuccess: () => {
      onSuccess?.();
      qc.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
