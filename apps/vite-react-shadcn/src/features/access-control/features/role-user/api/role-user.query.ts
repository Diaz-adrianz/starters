import type { ApiParams } from '@/lib/axios/api.type';
import { useQuery } from '@tanstack/react-query';
import { RoleUserApi } from './role-user.api';

export const queryKeys = {
  all: ['access-control', 'role-user'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: ApiParams) => [...queryKeys.lists(), params] as const,
};

export function useRoleUsers(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => RoleUserApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}
