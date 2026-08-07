import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';
import { DefaultLoggerService } from '../../logger/default/default-logger.service';

@Global()
@Module({
  providers: [
    DefaultCacheService,
    {
      provide: 'DEFAULT_CACHE_CLIENT',
      inject: [ConfigService, DefaultLoggerService],
      useFactory: (
        configService: ConfigService<EnvConfig>,
        loggerService: DefaultLoggerService,
      ) => {
        const client = new Redis({
          host: configService.getOrThrow('cache.default.host', { infer: true }),
          port: configService.getOrThrow('cache.default.port', { infer: true }),
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
