import { DynamicModule, Module } from '@nestjs/common';
import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import {
  CACHE_CONFIG_KEY,
  cacheConfig,
  CacheConfig,
} from '../../../config/cache.config';
import { ConfigModule } from '@nestjs/config';
import { QueueKeys } from '../queue-keys.constant';

@Module({
  imports: [
    BullModule.forRootAsync(QueueKeys.DEFAULT, {
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
export class DefaultQueueModule {
  static registerQueue(
    ...queues: Omit<RegisterQueueOptions, 'configKey'>[]
  ): DynamicModule {
    const inner = BullModule.registerQueue(
      ...queues.map((q) => ({ ...q, configKey: QueueKeys.DEFAULT })),
    );
    return {
      module: DefaultQueueModule,
      imports: [inner],
      exports: [inner],
    };
  }
}
