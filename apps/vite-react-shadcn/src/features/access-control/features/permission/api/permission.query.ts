import { useQuery } from '@tanstack/react-query';
import { PermissionApi } from './permission.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['access-control', 'permission'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
};

export function usePermissions(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => PermissionApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}

export function usePermission(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => PermissionApi.findOne(id),
    enabled: !!id && enabled,
  });
}
