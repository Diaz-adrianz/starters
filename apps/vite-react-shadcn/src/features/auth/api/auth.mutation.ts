import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from './auth.api';
import { keys } from './auth.queries';

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AuthApi.signIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
