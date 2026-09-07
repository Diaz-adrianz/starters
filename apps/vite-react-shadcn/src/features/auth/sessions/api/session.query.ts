import { useQuery } from '@tanstack/react-query';
import { SessionApi } from './session.api';

export const queryKeys = {
  all: ['auth', 'sessions'] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function useSessions({
  enabled = true,
  silent,
}: { enabled?: boolean; silent?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: SessionApi.findMany,
    select: (d) => d.data.data,
    enabled,
    meta: { silent },
  });
}
