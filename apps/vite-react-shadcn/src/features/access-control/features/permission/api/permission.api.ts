import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Permission } from '../types/permission.type';

const PRE = '/access-control/permissions/';

export const PermissionApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Permission>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Permission>>(PRE + id),
};
