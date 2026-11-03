import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdatePermissionValues } from '../schemas/permission.schema';
import { PermissionApi } from './permission.api';
import { queryKeys } from './permission.query';

export function useUpdatePermission({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdatePermissionValues;
    }) => PermissionApi.update(id, values),
    meta: {},
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}
