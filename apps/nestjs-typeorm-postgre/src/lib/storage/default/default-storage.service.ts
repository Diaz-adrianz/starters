import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectS3, type S3 } from 'nestjs-s3';
import {
  STORAGE_CONFIG_KEY,
  type StorageConfig,
} from '../../../config/storage.config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { MediaMimeType } from '../../../shared/constants/media-types.constant';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class DefaultStorageService {
  private readonly bucket: string;

  constructor(
    @Inject(STORAGE_CONFIG_KEY) storageConfig: StorageConfig,
    @InjectS3() private readonly s3: S3,
    private logger: LoggerService,
  ) {
    this.bucket = storageConfig.default.bucket;
  }

  async createPresignedPost({
    key,
    mimeType,
    size,
  }: {
    key: string;
    mimeType: MediaMimeType;
    size: number;
  }) {
    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [
        ['content-length-range', size, size],
        ['eq', '$Content-Type', mimeType],
      ],
      Fields: { 'Content-Type': mimeType },
      Expires: 300,
    });
    return { url, fields };
  }

  async copyObject(
    sourceKey: string,
    destinationKey: string,
    metadata: {
      etag: string;
      cacheControl?: string;
    },
  ) {
    let copied: CopyObjectCommandOutput;
    try {
      const head = await this.headObject(sourceKey);
      copied = await this.s3.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          Key: destinationKey,
          CopySource: `${this.bucket}/${sourceKey}`,
          CopySourceIfMatch: metadata.etag,
          MetadataDirective: 'REPLACE',
          CacheControl: metadata.cacheControl,
          ContentType: head.ContentType,
          ContentDisposition: head.ContentDisposition,
          ContentEncoding: head.ContentEncoding,
          ContentLanguage: head.ContentLanguage,
          Metadata: head.Metadata,
        }),
      );
    } catch (e: any) {
      if (
        e?.name === 'PreconditionFailed' ||
        e?.$metadata?.httpStatusCode === 412
      )
        throw new ConflictException('File changed since validation');
      if (e?.name === 'NoSuchKey' || e?.name === 'NotFound')
        throw new NotFoundException('Source file not found');
      throw e;
    }

    const etag = copied.CopyObjectResult?.ETag;
    if (!etag) {
      this.logger.warn(
        `CopyObject of from ${sourceKey} to ${destinationKey} returned no ETag`,
        this.constructor.name,
      );
      throw new UnprocessableEntityException(
        'Copied file could not be verified.',
      );
    }

    return { key: destinationKey, etag };
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
    try {
      return this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (e) {
      this.logger.error(
        `Failed to delete object ${key}: `,
        e,
        this.constructor.name,
      );
      throw e;
    }
  }
}
