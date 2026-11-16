import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './user.query';
import { UserApi } from './user.api';
import type { UpdateAvatarData } from '../types/user.type';

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

export function useResendInviteUser() {
  return useMutation({
    mutationFn: UserApi.resendInvite,
  });
}

export function useUpdateUserAvatar({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAvatarData }) =>
      UserApi.updateAvatar(id, data),
    meta: {},
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useArchiveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => UserApi.archive(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useRestoreUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => UserApi.restore(id),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UserApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}
