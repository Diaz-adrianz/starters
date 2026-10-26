import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleApi } from './role.api';
import { queryKeys } from './role.query';
import type { UpdateRoleValues } from '../schemas/role.schema';

export function useCreateRole({ onSuccess }: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateRole({ onSuccess }: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateRoleValues }) =>
      RoleApi.update(id, values),
    meta: {},
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useArchiveRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => RoleApi.archive(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useRestoreRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => RoleApi.restore(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}
