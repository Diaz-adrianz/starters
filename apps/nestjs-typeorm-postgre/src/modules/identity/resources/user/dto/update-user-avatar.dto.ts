import { IsIn, IsNotEmpty } from 'class-validator';
import { type MediaMimeType } from '../../../../../shared/constants/media-types.constant';
import { MB } from '../../../../../shared/utils/number.util';
import { IsStorageFile } from '../../../../../lib/storage/default/validators/is-storage-file';

export const UserAvatarMimeTypes: MediaMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const UserAvatarMaxBytes = 2 * MB;

export class UpdateUserAvatarDto {
  @IsNotEmpty()
  @IsStorageFile({
    mimeTypes: UserAvatarMimeTypes,
    maxBytes: UserAvatarMaxBytes,
  })
  avatar: string;
}

export class CreateUserAvatarUploadUrlDto {
  @IsNotEmpty()
  @IsIn(UserAvatarMimeTypes)
  mimeType: MediaMimeType;
}
