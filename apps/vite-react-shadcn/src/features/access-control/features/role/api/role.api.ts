import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Role } from '../types/role.type';

const PRE = '/access-control/roles/';

export const RoleApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Role>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Role>>(PRE + id),
};
