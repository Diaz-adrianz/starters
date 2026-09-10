import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Message } from '../types/message.type';

const PRE = '/notification/messages/';

export const MessageApi = {
  count: (params: ApiParams) =>
    apiClient.get<ApiResponse<number>>(PRE + 'count', { params }),
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Message>>(PRE, { params }),
};
