import { apiClient } from '@/lib/axios/api.client';
import type {
  ApiPaginatedResponse,
  ApiParams,
  ApiResponse,
} from '@/lib/axios/api.type';
import type { Profile } from '../types/profile.type';
import type {
  CreateProfileValues,
  UpdateProfileValues,
} from '../schemas/profile.schema';

const PRE = '/identity/profiles/';

export const ProfileApi = {
  findMany: (params: ApiParams) =>
    apiClient.get<ApiPaginatedResponse<Profile>>(PRE, { params }),
  findOne: (id: string) => apiClient.get<ApiResponse<Profile>>(PRE + id),
  create: (values: CreateProfileValues) =>
    apiClient.post<ApiResponse>(PRE, values),
  update: (id: string, values: UpdateProfileValues) =>
    apiClient.patch<ApiResponse>(PRE + id, values),
};
