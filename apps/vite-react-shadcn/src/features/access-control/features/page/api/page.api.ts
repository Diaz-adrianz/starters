import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Page } from '../types/page.type';

const PRE = '/access-control/pages/';

export const PageApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Page>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Page>>(PRE + id),
};
