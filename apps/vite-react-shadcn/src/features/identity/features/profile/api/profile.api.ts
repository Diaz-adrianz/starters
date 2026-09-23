import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Profile } from '../types/profile.type';

const PRE = '/identity/profiles/';

export const ProfileApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Profile>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Profile>>(PRE + id),
};
