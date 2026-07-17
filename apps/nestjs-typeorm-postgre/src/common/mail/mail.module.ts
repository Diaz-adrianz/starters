import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        transport: {
          host: configService.getOrThrow('mail.host', { infer: true }),
          port: configService.getOrThrow('mail.port', { infer: true }),
          secure: configService.getOrThrow('mail.secure', { infer: true }),
          auth: {
            user: configService.getOrThrow('mail.user', { infer: true }),
            pass: configService.getOrThrow('mail.pass', { infer: true }),
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
