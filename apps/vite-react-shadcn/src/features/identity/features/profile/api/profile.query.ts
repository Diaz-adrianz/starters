import { useQuery } from '@tanstack/react-query';
import { ProfileApi } from './profile.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['identity', 'profile'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useProfiles(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => ProfileApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}

export function useProfile(
  id: string,
  { enabled = true, silent }: { enabled?: boolean; silent?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => ProfileApi.findOne(id),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
    meta: { silent },
  });
}
