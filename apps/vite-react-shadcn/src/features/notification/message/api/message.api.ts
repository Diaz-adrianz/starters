import { apiClient } from '@/lib/axios/api.client';
import type { ApiPaginatedResponse, ApiParams } from '@/lib/axios/api.type';
import type { Message } from '../types/message.type';

const PRE = '/notification/messages/';

export const MessageApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Message>>(PRE, { params }),
};
