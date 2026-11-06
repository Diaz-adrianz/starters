import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';

const PRE = '/notification/push-tokens/';

export const PushTokenApi = {
  register: (data: { provider: string; token: string; enabled: boolean }) =>
    apiClient.post<ApiResponse>(PRE + 'register', data),
  revokeByToken: (token: string) =>
    apiClient.patch<ApiResponse>(PRE + token + '/revoke-by-token'),
};
