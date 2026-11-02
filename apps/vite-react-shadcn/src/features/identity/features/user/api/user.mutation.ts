import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './user.query';
import { UserApi } from './user.api';

export function useInviteUser({ onSuccess }: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UserApi.invite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}
