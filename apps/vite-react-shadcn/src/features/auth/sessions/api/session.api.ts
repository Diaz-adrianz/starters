import { apiClient } from '@/lib/axios/api.client';
import type { ApiPaginatedResponse, ApiResponse } from '@/lib/axios/api.type';
import type { Session } from '../types/session.type';

const PRE = '/auth/sessions/';

export const SessionApi = {
  findMany: () => apiClient.get<ApiPaginatedResponse<Session>>(PRE),
  remove: (id: string) => apiClient.delete<ApiResponse>(PRE + id),
  revoke: (id: string) => apiClient.patch<ApiResponse>(PRE + id + '/revoke'),
};
