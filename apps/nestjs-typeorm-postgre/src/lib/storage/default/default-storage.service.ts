import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectS3, type S3 } from 'nestjs-s3';

import {
  STORAGE_CONFIG_KEY,
  type StorageConfig,
} from '../../../config/storage.config';
import { CreatePresignedPostDto } from './dto/create-presigned-post.dto';
import { randomUUID } from 'crypto';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import {
  MediaExtensions,
  MediaMimeType,
} from '../../../shared/constants/media-types.constant';
import { StorageFileValidationError } from './classes/exceptions/storage.exception';
import { stringifyBytes } from '../../../shared/utils/string.util';
import { fileTypeFromStream } from 'file-type';

const TEMP_PREFIX = 'temp';

@Injectable()
export class DefaultStorageService {
  private readonly bucket: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    @Inject(STORAGE_CONFIG_KEY) private storageConfig: StorageConfig,
  ) {
    this.bucket = storageConfig.default.bucket;
  }

  async createPresignedPost(dto: CreatePresignedPostDto) {
    const key = `${TEMP_PREFIX}/${dto.ownerId}/${randomUUID()}`;
    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [
        ['content-length-range', dto.size, dto.size],
        ['eq', '$Content-Type', dto.mimeType],
      ],
      Fields: { 'Content-Type': dto.mimeType },
      Expires: 300,
    });
    return { url, fields };
  }

  validateTempOwner(key: string, ownerId: string, name = 'file'): void {
    const expectedPrefix = `${TEMP_PREFIX}/${ownerId}/`;

    if (!key.startsWith(expectedPrefix))
      throw new ForbiddenException(
        `Unauthorized access to this uploaded ${name}`,
      );

    const objectId = key.slice(expectedPrefix.length);
    if (!objectId || objectId.includes('/'))
      throw new BadRequestException(`Invalid ${name} temporary key`);
  }

  async validateFile(
    key: string,
    options: { mimeTypes?: MediaMimeType[]; maxSize?: number } = {},
    name = 'file',
  ) {
    let head: HeadObjectCommandOutput;
    try {
      head = await this.headObject(key);
    } catch {
      throw new StorageFileValidationError(`${name} does not exist`);
    }

    if (options.maxSize && (head.ContentLength ?? 0) > options.maxSize)
      throw new StorageFileValidationError(
        `${name} size exceeds maximum of ${stringifyBytes(options.maxSize)}`,
      );

    if (options.mimeTypes?.length) {
      const stream = await this.getObject(key, 'bytes=0-4095');
      if (!stream)
        throw new StorageFileValidationError(`${name} is not readable`);

      const fileType = await fileTypeFromStream(stream.transformToWebStream());
      const mime = fileType?.mime ?? '';

      if (!options.mimeTypes.includes(mime as MediaMimeType))
        throw new StorageFileValidationError(
          `${name} type ${MediaExtensions[mime] ?? 'unknown'} is not allowed`,
        );
    }

    return { key, etag: head.ETag?.replaceAll('"', '') ?? '' };
  }

  async getObject(key: string, range?: string) {
    const result = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key, Range: range }),
    );
    return result.Body;
  }

  async headObject(key: string) {
    return this.s3.send(
      new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async deleteObject(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
