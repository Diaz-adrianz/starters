import type { ApiParams } from '@/lib/axios/api.type';
import { useQuery } from '@tanstack/react-query';
import { RolePermissionApi } from './role-permission.api';

export const queryKeys = {
  all: ['access-control', 'role-permission'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: ApiParams) => [...queryKeys.lists(), params] as const,
};

export function useRolePermissions(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => RolePermissionApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}
