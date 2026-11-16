import { apiClient } from '@/lib/axios/api.client';
import type { ApiResponse } from '@/lib/axios/api.type';

const PRE = '/storage';

export const StorageApi = {
  createUpload: (data: { mimeType: string; size: number }) =>
    apiClient.post<
      ApiResponse<{
        url: string;
        fields: {
          'Content-Type': string;
          bucket: string;
          'X-Amz-Algorithm': string;
          'X-Amz-Credential': string;
          'X-Amz-Date': string;
          key: string;
          Policy: string;
          'X-Amz-Signature': string;
        };
      }>
    >(PRE + '/upload', data),
};
