import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { RoleUser } from '../types/role-user.type';

const PRE = '/access-control/role-users/';

export const RoleUserApi = {
  create: (data: { roleId: string; userId: string; username: string }) =>
    apiClient.post<ApiResponse>(PRE, data),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<RoleUser>>(PRE, { params }),
};
