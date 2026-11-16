import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';
import { IsStorageUploadValidator } from './decorators/validators/is-storage-upload.validator';

@Module({
  imports: [DefaultStorageModule],
  controllers: [StorageController],
  providers: [StorageService, IsStorageUploadValidator],
  exports: [StorageService],
})
export class StorageModule {}
