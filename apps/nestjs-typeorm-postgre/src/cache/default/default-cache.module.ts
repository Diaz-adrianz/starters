import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Global()
@Module({
  providers: [
    DefaultCacheService,
    {
      provide: 'DEFAULT_CACHE_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvConfig>) => {
        const client: RedisClientType = createClient({
          url: `redis://${configService.getOrThrow('cache.default.host', { infer: true })}:${configService.getOrThrow('cache.default.port', { infer: true })}`,
          socket: {
            reconnectStrategy: false,
            connectTimeout: 2000,
          },
        });

        // TODO: replace with logger
        client.on('error', () => console.error('Redis connection error'));
        client.on('connect', () => console.log('Redis connected'));
        client.on('ready', () => console.log('Redis ready'));
        client.on('end', () => console.log('Redis disconnected'));

        try {
          await client.connect();
        } catch {
          console.log('Redis initialization failed');
        }

        return client;
      },
    },
  ],
  exports: [DefaultCacheService],
})
export class DefaultCacheModule {}
