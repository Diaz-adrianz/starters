import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RolePermissionApi } from './role-permission.api';
import { queryKeys } from './role-permission.query';

export function useCreateRolePermission({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RolePermissionApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useDeleteRolePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RolePermissionApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}
