import { Module } from '@nestjs/common';
import { DefaultS3Service } from './default-s3.service';
import { S3Module } from 'nestjs-s3';
import { S3_CONFIG_KEY, s3Config, S3Config } from '../../../config/s3.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(s3Config),
    S3Module.forRootAsync({
      imports: [ConfigModule.forFeature(s3Config)],
      inject: [S3_CONFIG_KEY],
      useFactory: (s3Config: S3Config) => ({
        config: {
          credentials: {
            accessKeyId: s3Config.default.accessKeyId,
            secretAccessKey: s3Config.default.secretAccessKey,
          },
          region: s3Config.default.region,
          endpoint: s3Config.default.endpoint,
          forcePathStyle: s3Config.default.forcePathStyle,
        },
      }),
    }),
  ],
  providers: [DefaultS3Service],
  exports: [DefaultS3Service],
})
export class DefaultS3Module {}
