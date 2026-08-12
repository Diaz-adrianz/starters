import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  CACHE_CONFIG_KEY,
  cacheConfig,
  CacheConfig,
} from '../../../config/cache.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [CACHE_CONFIG_KEY],
      imports: [ConfigModule.forFeature(cacheConfig)],
      useFactory: (cacheConfig: CacheConfig) => ({
        connection: {
          host: cacheConfig.default.host,
          port: cacheConfig.default.port,
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class DefaultQueueModule {}
