import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { User } from '../types/user.type';

const PRE = '/identity/users/';

export const UserApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<User>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<User>>(PRE + id),
};
