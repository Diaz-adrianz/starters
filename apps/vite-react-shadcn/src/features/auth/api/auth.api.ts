import { apiClient } from '@/lib/axios/api.client';
import type { SignApiResponse } from '../types/auth.type';
import type { SignInValues } from '../schemas/auth.schema';

const PRE = '/auth';

export const AuthApi = {
  signIn: (values: SignInValues) =>
    apiClient.post<SignApiResponse>(PRE + '/sign-in', values, {
      skipRefresh: true,
    }),
  signOut: () => apiClient.post(PRE + '/sign-out'),
};
