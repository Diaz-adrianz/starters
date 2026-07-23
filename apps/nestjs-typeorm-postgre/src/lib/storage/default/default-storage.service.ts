import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, type S3 } from 'nestjs-s3';
import { EnvConfig } from '../../../config/env.config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { StorageKeys } from './constants/storage-keys';

type StorageKeyInput = ((keys: typeof StorageKeys) => string) | string;

@Injectable()
export class DefaultStorageService {
  private readonly bucket: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private configService: ConfigService<EnvConfig>,
  ) {
    this.bucket = configService.getOrThrow('storage.default.bucket', {
      infer: true,
    });
  }

  resolveKey(key: StorageKeyInput): string {
    return typeof key === 'string' ? key : key(StorageKeys);
  }

  async uploadObject(
    key: StorageKeyInput,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ) {
    const resolvedKey = this.resolveKey(key);
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: resolvedKey,
        Body: body,
        ContentType: contentType,
      }),
    );
    return { key };
  }

  async getObject(key: StorageKeyInput, range?: string) {
    const resolvedKey = this.resolveKey(key);
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: resolvedKey,
        Range: range,
      }),
    );
    return result.Body;
  }

  async headObject(key: StorageKeyInput) {
    const resolvedKey = this.resolveKey(key);
    return this.s3.send(
      new HeadObjectCommand({ Bucket: this.bucket, Key: resolvedKey }),
    );
  }

  async deleteObject(key: StorageKeyInput) {
    const resolvedKey = this.resolveKey(key);
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: resolvedKey }),
    );
  }

  async copyObject(
    sourceKey: StorageKeyInput,
    destinationKey: StorageKeyInput,
  ) {
    const resolvedSourceKey = this.resolveKey(sourceKey);
    const resolvedDestinationKey = this.resolveKey(destinationKey);

    await this.s3.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${resolvedSourceKey}`,
        Key: resolvedDestinationKey,
      }),
    );

    return { key: resolvedDestinationKey };
  }

  async moveObject(
    sourceKey: StorageKeyInput,
    destinationKey: StorageKeyInput,
  ) {
    const resolvedSourceKey = this.resolveKey(sourceKey);
    const resolvedDestinationKey = this.resolveKey(destinationKey);

    await this.copyObject(resolvedSourceKey, resolvedDestinationKey);
    await this.deleteObject(resolvedSourceKey);

    return { key: resolvedDestinationKey };
  }

  async listObjects(prefix: StorageKeyInput) {
    const resolvedPrefix = this.resolveKey(prefix);
    const result = await this.s3.send(
      new ListObjectsV2Command({ Bucket: this.bucket, Prefix: resolvedPrefix }),
    );
    return result.Contents ?? [];
  }

  async getSignedDownloadUrl(key: StorageKeyInput, expiresInSeconds = 3600) {
    const resolvedKey = this.resolveKey(key);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: resolvedKey,
    });
    return getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async getSignedUploadUrl(
    key: StorageKeyInput,
    contentType: string,
    maxSizeBytes = 5 * 1024 * 1024,
  ) {
    const resolvedKey = this.resolveKey(key);
    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: resolvedKey,
      Conditions: [
        ['content-length-range', 0, maxSizeBytes],
        ['eq', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 300,
    });

    return { url, fields };
  }
}
