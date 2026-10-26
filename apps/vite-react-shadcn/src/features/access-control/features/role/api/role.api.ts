import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Role, RolePermission, RoleUser } from '../types/role.type';
import type { CreateRoleValues } from '../schemas/role.schema';

const PRE = '/access-control/roles/';

export const RoleApi = {
  findManyUser: (id: string, params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RoleUser>>(PRE + id + '/users', {
      params,
    }),
  findManyPermission: (id: string, params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RolePermission>>(
      PRE + id + '/permissions',
      {
        params,
      }
    ),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Role>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Role>>(PRE + id),
  create: (values: CreateRoleValues) =>
    apiClient.post<ApiResponse>(PRE, values),
};
