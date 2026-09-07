import { useQuery } from '@tanstack/react-query';
import { SessionApi } from './session.api';

export const querykeys = {
  all: ['auth', 'sessions'] as const,
};

export function useSessions({
  enabled = true,
  silent,
}: { enabled?: boolean; silent?: boolean } = {}) {
  return useQuery({
    queryKey: querykeys.all,
    queryFn: SessionApi.findAll,
    select: (d) => d.data.data,
    enabled,
    meta: { silent },
  });
}
