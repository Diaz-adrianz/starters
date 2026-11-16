import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DefaultStorageService } from '../../lib/storage/default/default-storage.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { randomUUID } from 'crypto';
import {
  MediaExtensions,
  MediaMimeType,
} from '../../shared/constants/media-types.constant';
import { HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import { stringifyBytes } from '../../shared/utils/string.util';
import { fileTypeFromStream } from 'file-type';
import { LoggerService } from '../../infra/logger/logger.service';

const UPLOAD_PREFIX = 'temp';

@Injectable()
export class StorageService {
  constructor(
    private logger: LoggerService,
    private s3: DefaultStorageService,
  ) {}

  async createUpload({ ownerId, mimeType, size }: CreateUploadDto) {
    const key = `${UPLOAD_PREFIX}/${ownerId}/${randomUUID()}`;
    return this.s3.createPresignedPost({ key, mimeType, size });
  }

  async validateUpload({
    name = 'file',
    key,
    ownerId,
    format,
  }: {
    name?: string;
    key: string;
    ownerId: string;
    format: {
      mimeTypes?: MediaMimeType[];
      maxSize?: number;
    };
  }) {
    const expectedPrefix = `${UPLOAD_PREFIX}/${ownerId}/`;

    if (!key.startsWith(expectedPrefix))
      throw new ForbiddenException(
        `Unauthorized access to this uploaded ${name}`,
      );

    const objectId = key.slice(expectedPrefix.length);
    if (!objectId || objectId.includes('/'))
      throw new BadRequestException(`Invalid ${name} upload key`);

    let head: HeadObjectCommandOutput;
    try {
      head = await this.s3.headObject(key);
    } catch {
      throw new BadRequestException(`${name} does not exist`);
    }

    if (!head.ETag) {
      this.logger.warn(
        `HeadObject of uploaded ${name} ${key} returned no ETag`,
        this.constructor.name,
      );
      throw new UnprocessableEntityException(
        `Uploaded ${name} could not be verified. Please try again.`,
      );
    }

    if (format.maxSize && (head.ContentLength ?? 0) > format.maxSize)
      throw new BadRequestException(
        `${name} size exceeds maximum of ${stringifyBytes(format.maxSize)}`,
      );

    if (format.mimeTypes?.length) {
      const stream = await this.s3.getObject(key, 'bytes=0-4095');
      if (!stream) throw new BadRequestException(`${name} is not readable`);

      const fileType = await fileTypeFromStream(stream.transformToWebStream());
      const mime = fileType?.mime ?? '';

      if (!format.mimeTypes.includes(mime as MediaMimeType))
        throw new BadRequestException(
          `${name} type ${MediaExtensions[mime] ?? 'unknown'} is not allowed`,
        );
    }

    return { key, etag: head.ETag };
  }

  async move(
    sourceKey: string,
    destinationKey: string,
    metadata: {
      etag: string;
      cacheControl?: string;
    },
  ) {
    if (sourceKey === destinationKey)
      throw new BadRequestException('Source and destination must differ');

    const copied = await this.s3.copyObject(
      sourceKey,
      destinationKey,
      metadata,
    );
    await this.s3.deleteObject(sourceKey).catch();

    return { key: copied.key, etag: copied.etag };
  }

  async delete(key: string) {
    return this.s3.deleteObject(key);
  }
}
