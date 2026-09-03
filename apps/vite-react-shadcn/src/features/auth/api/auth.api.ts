import type { User } from '@/features/identity';
import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';

const PRE = '/auth';

export const AuthApi = {
  me: () => apiClient.get<ApiResponse<{ user: User }>>(PRE + '/me'),
};
