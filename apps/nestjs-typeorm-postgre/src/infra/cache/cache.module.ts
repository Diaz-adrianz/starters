import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import {
  CACHE_CONFIG_KEY,
  CacheConfig,
  cacheConfig,
} from '../../config/cache.config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      imports: [ConfigModule.forFeature(cacheConfig)],
      inject: [CACHE_CONFIG_KEY],
      useFactory: (config: CacheConfig) => ({
        max: config.max,
        ttl: config.ttl,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
