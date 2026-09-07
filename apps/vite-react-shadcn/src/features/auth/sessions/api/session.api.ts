import { apiClient } from '@/lib/axios/api.client';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Session } from '../types/session.type';

const PRE = '/auth/sessions/';

export const SessionApi = {
  findAll: () => apiClient.get<ApiPaginatedResponse<Session>>(PRE),
};
