import { apiClient } from '@/lib/axios/api.client';
import type {
  AcceptInviteCheckValues,
  AcceptInviteValues,
} from '../schemas/identity.schema';
import type { ApiResponse } from '@/lib/axios/api.type';
import type { AcceptInviteCheckResponse } from '../type/identity.type';

const PRE = '/identity/';

export const IdentityApi = {
  forgotPassword: (data: { email: string }) =>
    apiClient.post(PRE + 'forgot-password', data),
  acceptInviteCheck: (values: AcceptInviteCheckValues) =>
    apiClient.post<AcceptInviteCheckResponse>(
      PRE + 'accept-invite-check',
      values
    ),
  acceptInvite: (values: AcceptInviteValues) =>
    apiClient.post<ApiResponse>(PRE + 'accept-invite', values),
};
