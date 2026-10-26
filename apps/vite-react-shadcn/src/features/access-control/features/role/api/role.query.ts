import { useQuery } from '@tanstack/react-query';
import { RoleApi } from './role.api';
import type { ApiParams } from '@/lib/axios/api.type';

export const queryKeys = {
  all: ['access-control', 'role'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: ApiParams) => [...queryKeys.lists(), params] as const,
  detail: (id: string) => [...queryKeys.all, 'detail', id] as const,
  listUser: (id: string, params: ApiParams) =>
    [...queryKeys.detail(id), 'users', params] as const,
  listPermissions: (id: string, params: ApiParams) =>
    [...queryKeys.detail(id), 'permission', params] as const,
};

export function useRoleUsers(
  id: string,
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.listUser(id, params),
    queryFn: () => RoleApi.findManyUser(id, params),
    select: (d) => d.data.data,
    enabled: !!id && enabled,
  });
}

export function useRolePermissions(
  id: string,
  params: ApiParams = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.listPermissions(id, params),
    queryFn: () => RoleApi.findManyPermission(id, params),
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
