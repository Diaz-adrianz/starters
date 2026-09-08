import { useQuery } from '@tanstack/react-query';
import { SessionApi } from './session.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['auth', 'sessions'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useSessions(
  params: ApiParams = {},
  { enabled = true, silent }: { enabled?: boolean; silent?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => SessionApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
    meta: { silent },
  });
}
