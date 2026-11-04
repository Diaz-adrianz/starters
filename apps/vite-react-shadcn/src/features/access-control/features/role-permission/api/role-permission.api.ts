import { apiClient } from '@/lib/axios/api.client';
import type { ApiPaginatedResponse, ApiParams } from '@/lib/axios/api.type';
import type { RolePermission } from '../types/role-permission.type';

const PRE = '/access-control/role-permissions/';

export const RolePermissionApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RolePermission>>(PRE, { params }),
};
