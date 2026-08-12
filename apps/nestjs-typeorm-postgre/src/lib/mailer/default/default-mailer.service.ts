import { promises as fs } from 'fs';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
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

  async renderTemplate(
    fileName: string,
    payload: Record<string, any>,
  ): Promise<string> {
    const templatesDir = this.mailerConfig.default.templatesPath,
      file = await fs.readFile(join(templatesDir, fileName), {
        encoding: 'utf-8',
      }),
      template = Handlebars.compile(file);
    return template(payload);
  }

  async send(params: {
    from?: string;
    to: string;
    subject: string;
    content: string | { fileName: string; payload: Record<string, any> };
  }): Promise<void> {
    const sender = this.mailerConfig.default.sender;
    const from = params.from ?? `${sender} <${this.mailerConfig.default.user}>`;

    const content =
      typeof params.content == 'string'
        ? params.content
        : await this.renderTemplate(params.content.fileName, {
            sender,
            ...params.content.payload,
          });

    await this.mailerService.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      html: content,
    });
  }
}
