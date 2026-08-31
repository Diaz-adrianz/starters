import { SetMetadata } from '@nestjs/common';

export interface ResSuccessMetadata {
  message?: string;
  allowNoAffected?: boolean;
}

export const RES_SUCCESS_METADATA = 'RES_SUCCESS';

export const ResSuccess = (data: ResSuccessMetadata) =>
  SetMetadata(RES_SUCCESS_METADATA, data);
