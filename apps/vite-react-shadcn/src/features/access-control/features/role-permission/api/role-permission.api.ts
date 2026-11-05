import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { RolePermission } from '../types/role-permission.type';

const PRE = '/access-control/role-permissions/';

export const RolePermissionApi = {
  create: (data: {
    roleId: string;
    permissionId: string;
    condition: RolePermission['condition'];
  }) => apiClient.post<ApiResponse>(PRE, data),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RolePermission>>(PRE, { params }),
  delete: (id: string) => apiClient.delete<ApiResponse>(PRE + id),
};
