import { useQuery } from '@tanstack/react-query';
import { AuthApi } from './auth.api';

export const keys = {
  all: ['auth'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
};

export function useMe(enabled = true) {
  return useQuery({
    queryKey: keys.detail('me'),
    queryFn: () => AuthApi.me(),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled,
  });
}
