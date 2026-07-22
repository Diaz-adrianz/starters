import { promises as fs } from 'fs';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import { EnvConfig } from '../../../config/env.config';

@Injectable()
export class DefaultMailerService {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private mailerService: MailerService,
  ) {}

  async renderTemplate(
    fileName: string,
    payload: Record<string, any>,
  ): Promise<string> {
    const templatesDir = this.configService.getOrThrow(
        'mailer.default.templatesPath',
        { infer: true },
      ),
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
    const sender = this.configService.getOrThrow('mailer.default.sender', {
      infer: true,
    });
    const from =
      params.from ??
      `${sender} <${this.configService.getOrThrow('mailer.default.user', { infer: true })}>`;

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
