import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '../../../infra/logger/logger.service';
import {
  REDIS_CONFIG_KEY,
  RedisConfig,
  redisConfig,
} from '../../../config/redis.config';
import { DefaultRedisService } from './default-redis.service';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    DefaultRedisService,
    {
      provide: 'DEFAULT_REDIS_CLIENT',
      inject: [REDIS_CONFIG_KEY, LoggerService],
      useFactory: (redisConfig: RedisConfig, logger: LoggerService) => {
        const client = new Redis({
          host: redisConfig.default.host,
          port: redisConfig.default.port,
          connectTimeout: 2000,
        });

        client.on('error', (err) => logger.error(err, 'Redis'));
        client.on('connect', () => logger.log('Redis connected', 'Redis'));
        client.on('ready', () => logger.log('Redis ready', 'Redis'));
        client.on('end', () => logger.log('Redis disconnected', 'Redis'));

        return client;
      },
    },
  ],
  exports: [DefaultRedisService],
})
export class DefaultRedisModule {}
