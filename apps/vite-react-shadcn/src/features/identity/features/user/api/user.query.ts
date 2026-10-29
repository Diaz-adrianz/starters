import { useQuery } from '@tanstack/react-query';
import { UserApi } from './user.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['identity', 'user'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useUsers(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => UserApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}

export function useUser(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => UserApi.findOne(id),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
  });
}
