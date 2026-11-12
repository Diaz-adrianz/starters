import { IsNotEmpty } from 'class-validator';
import { type MediaMimeType } from '../../../../../shared/constants/media-types.constant';
import { MB } from '../../../../../shared/utils/number.util';
import {
  IsStorageFile,
  type IsStorageFileResult,
} from '../../../../../lib/storage/default/decorators/validators/is-storage-file.validator';

export const UserAvatarMimeTypes: MediaMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const UserAvatarMaxSize = 2 * MB;

export class UpdateUserAvatarDto {
  @IsNotEmpty()
  @IsStorageFile({
    mimeTypes: UserAvatarMimeTypes,
    maxSize: UserAvatarMaxSize,
  })
  avatar: IsStorageFileResult;
}
