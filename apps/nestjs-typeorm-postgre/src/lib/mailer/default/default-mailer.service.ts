import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import {
  MAILER_CONFIG_KEY,
  type MailerConfig,
} from '../../../config/mailer.config';

@Injectable()
export class DefaultMailerService {
  constructor(
    @Inject(MAILER_CONFIG_KEY) private mailerConfig: MailerConfig,
    private mailerService: MailerService,
  ) {}

  async send(
    to: string,
    subject: string,
    content: string,
    options?: {
      sender?: {
        name: string;
        email: string;
      };
      replyTo?: string;
    },
  ): Promise<void> {
    let { name, email } = this.mailerConfig.default.sender;
    if (options?.sender) {
      name = options.sender.name;
      email = options.sender.email;
    }

    await this.mailerService.sendMail({
      from: `${name} <${email}>`,
      to: to,
      subject: subject,
      html: content,
      replyTo: options?.replyTo,
    });
  }
}
