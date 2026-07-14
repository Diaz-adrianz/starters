import { Global, Module } from '@nestjs/common';
import { DefaultCacheService } from './default-cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { EnvConfig } from '../../config/env.config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => {
        const redisStore = new KeyvRedis({
          url: `redis://${configService.getOrThrow('cache.default.host', { infer: true })}:${configService.getOrThrow('cache.default.port', { infer: true })}`,
          socket: {
            reconnectStrategy: false,
            connectTimeout: 2000,
          },
        });

        // TODO: replace with logger
        redisStore.on('error', () => {
          console.error('Redis connection error');
        });

        redisStore.on('connect', () => {
          console.log('Redis connected');
        });

        redisStore.on('ready', () => {
          console.log('Redis ready');
        });

        return {
          stores: [redisStore],
        };
      },
    }),
  ],
  providers: [DefaultCacheService],
  exports: [DefaultCacheService],
})
export class DefaultCacheModule {}
