import { Global, Module } from '@nestjs/common';
import { DefaultStorageService } from './default-storage.service';
import { S3Module } from 'nestjs-s3';
import { DefaultLoggerService } from '../../logger/default/default-logger.service';
import { DefaultStorageController } from './default-storage.controller';
import { IsStorageFileConstraint } from './validators/is-storage-file';
import {
  STORAGE_CONFIG_KEY,
  storageConfig,
  StorageConfig,
} from '../../../config/storage.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    S3Module.forRootAsync({
      imports: [ConfigModule.forFeature(storageConfig)],
      inject: [STORAGE_CONFIG_KEY, DefaultLoggerService],
      useFactory: (
        storageConfig: StorageConfig,
        loggerService: DefaultLoggerService,
      ) => ({
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
              loggerService.error(content, 'Storage');
            },
            debug() {
              // silent
            },
            warn(...content) {
              loggerService.warn(content, 'Storage');
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
