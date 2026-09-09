import { useQuery } from '@tanstack/react-query';
import type { ApiParams } from '@/lib/axios/api.type';
import { MessageApi } from './message.api';

export const queryKeys = {
  all: ['notification', 'messages'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useMessages(
  params: ApiParams = {},
  { enabled = true, silent }: { enabled?: boolean; silent?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => MessageApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
    meta: { silent },
  });
}
