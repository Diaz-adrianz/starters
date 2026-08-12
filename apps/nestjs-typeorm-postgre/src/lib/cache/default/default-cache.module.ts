import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import Redis from 'ioredis';
import {
  CACHE_CONFIG_KEY,
  cacheConfig,
  type CacheConfig,
} from '../../../config/cache.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '../../../infra/logger/logger.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(cacheConfig)],
  providers: [
    DefaultCacheService,
    {
      provide: 'DEFAULT_CACHE_CLIENT',
      inject: [CACHE_CONFIG_KEY, LoggerService],
      useFactory: (cacheConfig: CacheConfig, logger: LoggerService) => {
        const client = new Redis({
          host: cacheConfig.default.host,
          port: cacheConfig.default.port,
          connectTimeout: 2000,
        });

        client.on('error', (err) => logger.error(err, 'Cache'));
        client.on('connect', () => logger.info('Redis connected', 'Cache'));
        client.on('ready', () => logger.info('Redis ready', 'Cache'));
        client.on('end', () => logger.info('Redis disconnected', 'Cache'));

        return client;
      },
    },
  ],
  exports: [DefaultCacheService],
})
export class DefaultCacheModule {}
