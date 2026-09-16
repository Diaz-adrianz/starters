import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';

const PRE = '/access-control/';

export const AccessControlApi = {
  userAccessList: () =>
    apiClient.get<
      ApiResponse<{ roles: string[]; pages: string[]; permissions: string[] }>
    >(PRE + 'me'),
};
