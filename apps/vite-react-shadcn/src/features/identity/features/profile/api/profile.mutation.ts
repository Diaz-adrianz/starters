import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './profile.query';
import { ProfileApi } from './profile.api';
import type { UpdateProfileValues } from '../schemas/profile.schema';

export function useCreateProfile({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ProfileApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateProfile({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateProfileValues }) =>
      ProfileApi.update(id, values),
    meta: {},
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      onSuccess?.();
    },
  });
}
