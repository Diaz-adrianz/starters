import { useMutation } from '@tanstack/react-query';
import { IdentityApi } from './identity.api';

export function useAcceptInviteCheck({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  return useMutation({
    mutationFn: IdentityApi.acceptInviteCheck,
    onSuccess: () => {
      onSuccess?.();
    },
  });
}

export function useAcceptInvite({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  return useMutation({
    mutationFn: IdentityApi.acceptInvite,
    onSuccess: () => {
      onSuccess?.();
    },
  });
}
