import { apiClient } from '@/lib/axios/api.client';
import type { ApiPaginatedResponse, ApiParams } from '@/lib/axios/api.type';
import type { RoleUser } from '../types/role-user.type';

const PRE = '/access-control/role-users/';

export const RoleUserApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RoleUser>>(PRE, { params }),
};
