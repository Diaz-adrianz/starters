import { Global, Module } from '@nestjs/common';
import { DefaultMailerService } from './default-mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';

@Global()
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        transport: {
          host: configService.getOrThrow('mailer.default.host', {
            infer: true,
          }),
          port: configService.getOrThrow('mailer.default.port', {
            infer: true,
          }),
          secure: configService.getOrThrow('mailer.default.secure', {
            infer: true,
          }),
          auth: {
            user: configService.getOrThrow('mailer.default.user', {
              infer: true,
            }),
            pass: configService.getOrThrow('mailer.default.pass', {
              infer: true,
            }),
          },
        },
      }),
    }),
  ],
  providers: [DefaultMailerService],
  exports: [DefaultMailerService],
})
export class DefaultMailerModule {}
