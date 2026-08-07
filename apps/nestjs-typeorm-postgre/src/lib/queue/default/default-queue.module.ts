import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        connection: {
          host: configService.getOrThrow('cache.default.host', { infer: true }),
          port: configService.getOrThrow('cache.default.port', { infer: true }),
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class DefaultQueueModule {}
