import { Global, Module } from '@nestjs/common';
import { DefaultMailerService } from './default-mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import {
  MAILER_CONFIG_KEY,
  mailerConfig,
  MailerConfig,
} from '../../../config/mailer.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(mailerConfig),
    NestMailerModule.forRootAsync({
      inject: [MAILER_CONFIG_KEY],
      imports: [ConfigModule.forFeature(mailerConfig)],
      useFactory: (mailerConfig: MailerConfig) => ({
        transport: {
          host: mailerConfig.default.host,
          port: mailerConfig.default.port,
          secure: mailerConfig.default.secure,
          auth: {
            user: mailerConfig.default.user,
            pass: mailerConfig.default.pass,
          },
        },
      }),
    }),
  ],
  providers: [DefaultMailerService],
  exports: [DefaultMailerService],
})
export class DefaultMailerModule {}
