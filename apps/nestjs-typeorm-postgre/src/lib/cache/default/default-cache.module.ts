import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import Redis from 'ioredis';
import { DefaultLoggerService } from '../../logger/default/default-logger.service';
import {
  CACHE_CONFIG_KEY,
  cacheConfig,
  type CacheConfig,
} from '../../../config/cache.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(cacheConfig)],
  providers: [
    DefaultCacheService,
    {
      provide: 'DEFAULT_CACHE_CLIENT',
      inject: [CACHE_CONFIG_KEY, DefaultLoggerService],
      useFactory: (
        cacheConfig: CacheConfig,
        loggerService: DefaultLoggerService,
      ) => {
        const client = new Redis({
          host: cacheConfig.default.host,
          port: cacheConfig.default.port,
          connectTimeout: 2000,
        });

        client.on('error', (err) => loggerService.error(err, 'Cache'));
        client.on('connect', () =>
          loggerService.info('Redis connected', 'Cache'),
        );
        client.on('ready', () => loggerService.info('Redis ready', 'Cache'));
        client.on('end', () =>
          loggerService.info('Redis disconnected', 'Cache'),
        );

        return client;
      },
    },
  ],
  exports: [DefaultCacheService],
})
export class DefaultCacheModule {}
