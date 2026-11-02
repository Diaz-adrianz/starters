import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { User } from '../types/user.type';
import type { InviteUserValues } from '../schemas/user.schema';

const PRE = '/identity/users/';

export const UserApi = {
  invite: (values: InviteUserValues) =>
    apiClient.post<ApiResponse>(PRE + 'invite', values),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<User>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<User>>(PRE + id),
};
