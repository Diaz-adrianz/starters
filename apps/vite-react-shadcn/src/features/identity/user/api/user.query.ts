import { useQuery } from '@tanstack/react-query';
import { UserApi } from './user.api';

export const queryKeys = {
  all: ['identity', 'user'] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useUser(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => UserApi.findOne(id),
    enabled: !!id && enabled,
  });
}
