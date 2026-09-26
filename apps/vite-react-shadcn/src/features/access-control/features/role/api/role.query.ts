import { useQuery } from '@tanstack/react-query';
import { RoleApi } from './role.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['access-control', 'role'] as const,
  list: (params: ApiParams) => [...queryKeys.all, 'list', params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
  listUsers: (id: string, params: ApiParams) =>
    [...queryKeys.detail(id), 'users', params] as const,
};

export function useRoleUsers(
  id: string,
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.listUsers(id, params),
    queryFn: () => RoleApi.findManyUser(id, params),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
  });
}

export function useRoles(
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => RoleApi.findMany(params),
    select: (d) => d.data.data,
    enabled,
  });
}

export function useRole(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => RoleApi.findOne(id),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
  });
}
