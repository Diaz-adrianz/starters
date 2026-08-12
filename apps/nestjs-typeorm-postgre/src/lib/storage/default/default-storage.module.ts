import { Module } from '@nestjs/common';
import { DefaultStorageService } from './default-storage.service';
import { S3Module } from 'nestjs-s3';
import { DefaultStorageController } from './default-storage.controller';
import { IsStorageFileConstraint } from './validators/is-storage-file';
import {
  STORAGE_CONFIG_KEY,
  storageConfig,
  StorageConfig,
} from '../../../config/storage.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '../../../infra/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    S3Module.forRootAsync({
      imports: [ConfigModule.forFeature(storageConfig)],
      inject: [STORAGE_CONFIG_KEY, LoggerService],
      useFactory: (storageConfig: StorageConfig, logger: LoggerService) => ({
        config: {
          credentials: {
            accessKeyId: storageConfig.default.accessKeyId,
            secretAccessKey: storageConfig.default.secretAccessKey,
          },
          region: storageConfig.default.region,
          endpoint: storageConfig.default.endpoint,
          forcePathStyle: storageConfig.default.forcePathStyle,
          logger: {
            info() {
              // silent
            },
            error(...content) {
              logger.error(content, 'Storage');
            },
            debug() {
              // silent
            },
            warn(...content) {
              logger.warn(content, 'Storage');
            },
          },
        },
      }),
    }),
  ],
  providers: [DefaultStorageService, IsStorageFileConstraint],
  controllers: [DefaultStorageController],
  exports: [DefaultStorageService],
})
export class DefaultStorageModule {}
