import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Permission } from '../types/permission.type';
import type { UpdatePermissionValues } from '../schemas/permission.schema';

const PRE = '/access-control/permissions/';

export const PermissionApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Permission>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Permission>>(PRE + id),
  update: (id: string, values: UpdatePermissionValues) =>
    apiClient.patch<ApiResponse>(PRE + id, values),
};
