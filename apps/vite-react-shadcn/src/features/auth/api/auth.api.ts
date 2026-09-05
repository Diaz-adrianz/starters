import type { User } from '@/features/identity';
import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';
import type { SignApiResponse } from '../types/auth.type';
import type { SignInValues } from '../schemas/auth.schema';

const PRE = '/auth';

export const AuthApi = {
  me: () => apiClient.get<ApiResponse<{ user: User }>>(PRE + '/me'),
  signIn: (values: SignInValues) =>
    apiClient.post<SignApiResponse>(PRE + '/sign-in', values),
  signOut: () => apiClient.post(PRE + '/sign-out'),
};
