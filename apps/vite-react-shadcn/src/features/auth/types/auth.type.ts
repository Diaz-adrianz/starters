import type { ApiResponse } from '@/lib/axios/api.type';

export type RefreshApiResponse = ApiResponse<{
  tokens: {
    access: string;
    refresh: string;
  };
}>;
