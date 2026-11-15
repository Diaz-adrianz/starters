import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';

@Module({
  imports: [DefaultStorageModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
