import type { ApiResponse } from '@/lib/axios/api.type';

export type AcceptInviteCheckResponse = ApiResponse<{
  expiresAt: string;
  email: string;
  username: string;
}>;
