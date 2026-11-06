import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Activity } from '../types/activity.type';

const PRE = '/audit/activities/';

export const ActivityApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Activity>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Activity>>(PRE + id),
};
