import { useQuery } from '@tanstack/react-query';
import { ActivityApi } from './activity.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['audit', 'activity'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: ApiParams) => [...queryKeys.lists(), params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useActivities(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => ActivityApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}

export function useActivity(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => ActivityApi.findOne(id),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
  });
}
