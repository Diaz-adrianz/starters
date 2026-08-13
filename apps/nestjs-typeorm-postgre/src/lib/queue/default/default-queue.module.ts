import { DynamicModule, Module } from '@nestjs/common';
import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QueueKeys } from '../queue-keys.constant';
import { QueueConfig, queueConfig } from '../../../config/queue.config';

@Module({
  imports: [
    BullModule.forRootAsync(QueueKeys.DEFAULT, {
      imports: [ConfigModule.forFeature(queueConfig)],
      useFactory: (queueConfig: QueueConfig) => ({
        connection: {
          host: queueConfig.default.redis.host,
          port: queueConfig.default.redis.port,
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
