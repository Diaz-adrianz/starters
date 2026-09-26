import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Role, RoleUser } from '../types/role.type';

const PRE = '/access-control/roles/';

export const RoleApi = {
  findManyUser: (id: string, params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RoleUser>>(PRE + id + '/users', {
      params,
    }),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Role>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Role>>(PRE + id),
};
