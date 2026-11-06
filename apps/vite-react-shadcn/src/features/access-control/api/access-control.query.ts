import { useQuery } from '@tanstack/react-query';
import { AccessControlApi } from './access-control.api';

export const queryKeys = {
  all: ['access-control'] as const,
};

export function useUserAccessList({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: () => AccessControlApi.userAccessList(),
    select: (d) => d.data.data,
    enabled,
  });
}
