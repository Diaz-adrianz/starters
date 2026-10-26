import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleApi } from './role.api';
import { queryKeys } from './role.query';

export function useCreateRole({ onSuccess }: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all });
      onSuccess?.();
    },
  });
}
