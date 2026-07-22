import { Module } from '@nestjs/common';
import { DefaultStorageService } from './default-storage.service';
import { S3Module } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';
import { DefaultLoggerService } from '../../logger/default/default-logger.service';
import { DefaultStorageController } from './default-storage.controller';

@Module({
  imports: [
    S3Module.forRootAsync({
      inject: [ConfigService, DefaultLoggerService],

      useFactory: (
        configService: ConfigService<EnvConfig>,
        loggerService: DefaultLoggerService,
      ) => ({
        config: {
          credentials: {
            accessKeyId: configService.getOrThrow(
              'storage.default.accessKeyId',
              { infer: true },
            ),
            secretAccessKey: configService.getOrThrow(
              'storage.default.secretAccessKey',
              { infer: true },
            ),
          },
          region: configService.getOrThrow('storage.default.region', {
            infer: true,
          }),
          endpoint: configService.getOrThrow('storage.default.endpoint', {
            infer: true,
          }),
          forcePathStyle: configService.getOrThrow(
            'storage.default.forcePathStyle',
            { infer: true },
          ),
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
  providers: [DefaultStorageService],
  controllers: [DefaultStorageController],
})
export class DefaultStorageModule {}
