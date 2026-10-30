import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Session } from '../types/session.type';

const PRE = '/auth/sessions/';

export const SessionApi = {
  revoke: (id: string) => apiClient.patch<ApiResponse>(PRE + id + '/revoke'),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Session>>(PRE, { params }),
  delete: (id: string) => apiClient.delete<ApiResponse>(PRE + id),
};
