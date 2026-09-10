import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';
import type { User } from '../types/user.type';

const PRE = '/identity/users/';

export const UserApi = {
  findOne: (id: string) => apiClient.get<ApiResponse<User>>(PRE + id),
};
