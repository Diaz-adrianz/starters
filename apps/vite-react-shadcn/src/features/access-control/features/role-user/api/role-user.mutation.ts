import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleUserApi } from './role-user.api';
import { queryKeys } from './role-user.query';

export function useCreateRoleUser({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleUserApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}
