import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';

@Global()
@Module({
  providers: [
    DefaultCacheService,
    {
      provide: 'DEFAULT_CACHE_CLIENT',
      inject: [ConfigService, DefaultLoggerService],
      useFactory: async (
        configService: ConfigService<EnvConfig>,
        logger: DefaultLoggerService,
      ) => {
        const client: RedisClientType = createClient({
          url: `redis://${configService.getOrThrow('cache.default.host', { infer: true })}:${configService.getOrThrow('cache.default.port', { infer: true })}`,
          socket: {
            connectTimeout: 2000,
          },
        });

        client.on('error', (err) => logger.error(err, 'Cache'));
        client.on('connect', () => logger.info('Redis connected', 'Cache'));
        client.on('ready', () => logger.info('Redis ready', 'Cache'));
        client.on('end', () => logger.info('Redis disconnected', 'Cache'));

        try {
          await client.connect();
        } catch (err) {
          logger.error(err, 'Cache');
        }

        return client;
      },
    },
  ],
  exports: [DefaultCacheService],
})
export class DefaultCacheModule {}
