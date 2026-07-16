import { SetMetadata } from '@nestjs/common';

export interface ResponseSuccessMetadata {
  message?: string;
}

export const RESPONSE_SUCCESS_METADATA = 'RESPONSE_SUCCESS';

export const ResponseSuccess = (data: ResponseSuccessMetadata) =>
  SetMetadata(RESPONSE_SUCCESS_METADATA, data);
