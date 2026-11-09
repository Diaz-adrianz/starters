import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { InjectS3, type S3 } from 'nestjs-s3';

import {
  STORAGE_CONFIG_KEY,
  type StorageConfig,
} from '../../../config/storage.config';

@Injectable()
export class DefaultStorageService {
  private readonly bucket: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    @Inject(STORAGE_CONFIG_KEY) private storageConfig: StorageConfig,
  ) {
    this.bucket = storageConfig.default.bucket;
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
