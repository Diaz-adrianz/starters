import { type MediaMimeType } from '../../../../../shared/constants/media-types.constant';
import { MB } from '../../../../../shared/utils/number.util';
import {
  IsStorageUpload,
  type IsStorageUploadResult,
} from '../../../../storage/decorators/validators/is-storage-upload.validator';
import { IsNullable } from '../../../../../common/decorators/validators/is-nullable';

export const UserAvatarMimeTypes: MediaMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const UserAvatarMaxSize = 2 * MB;

export class UpdateUserAvatarDto {
  @IsNullable()
  @IsStorageUpload({
    mimeTypes: UserAvatarMimeTypes,
    maxSize: UserAvatarMaxSize,
  })
  avatar: IsStorageUploadResult | null;
}
