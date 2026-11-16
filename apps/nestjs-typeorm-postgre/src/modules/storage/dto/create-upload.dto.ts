import { IsIn, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Exclude } from 'class-transformer';
import { MB } from '../../../shared/utils/number.util';
import {
  type MediaMimeType,
  MediaMimeTypes,
} from '../../../shared/constants/media-types.constant';

export const MAX_UPLOAD_SIZE = 50 * MB;

export class CreateUploadDto {
  @IsNotEmpty()
  @IsIn(MediaMimeTypes)
  mimeType: MediaMimeType;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(MAX_UPLOAD_SIZE)
  size: number;

  @Exclude()
  ownerId: string;
}
