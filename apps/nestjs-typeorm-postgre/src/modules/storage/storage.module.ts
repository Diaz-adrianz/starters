import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { IsStorageUploadValidator } from './decorators/validators/is-storage-upload.validator';
import { DefaultS3Module } from '../../lib/s3/default/default-s3.module';

@Module({
  imports: [DefaultS3Module],
  controllers: [StorageController],
  providers: [StorageService, IsStorageUploadValidator],
  exports: [StorageService],
})
export class StorageModule {}
