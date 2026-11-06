import type { User } from '@/features/identity';
import type { ApiResponse } from '@/lib/axios/api.type';

export type SignApiResponse = ApiResponse<{
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}>;

export type RefreshApiResponse = ApiResponse<{
  tokens: {
    access: string;
    refresh: string;
  };
}>;
