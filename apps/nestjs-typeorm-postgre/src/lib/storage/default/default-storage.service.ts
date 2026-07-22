import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, type S3 } from 'nestjs-s3';
import { EnvConfig } from '../../../config/env.config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

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

  async uploadObject(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return { key };
  }

  async getObject(key: string) {
    const result = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
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

  async listObjects(prefix?: string) {
    const result = await this.s3.send(
      new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix }),
    );
    return result.Contents ?? [];
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds = 3600) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async getSignedUploadUrl(
    key: string,
    contentType: string,
    maxSizeBytes = 5 * 1024 * 1024,
  ) {
    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
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
