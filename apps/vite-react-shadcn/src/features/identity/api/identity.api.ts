import { apiClient } from '@/lib/axios/api.client';
import type {
  AcceptInviteCheckValues,
  AcceptInviteValues,
} from '../schemas/identity.schema';
import type { ApiResponse } from '@/lib/axios/api.type';

const PRE = '/identity/';

export const IdentityApi = {
  acceptInviteCheck: (values: AcceptInviteCheckValues) =>
    apiClient.post<ApiResponse<{ expiresIn: string; email: string }>>(
      PRE + 'accept-invite-check',
      values
    ),
  acceptInvite: (values: AcceptInviteValues) =>
    apiClient.post<ApiResponse>(PRE + 'accept-invite', values),
};
