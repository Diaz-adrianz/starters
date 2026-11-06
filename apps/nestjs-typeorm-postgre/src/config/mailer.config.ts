import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  MAILER_DEFAULT_HOST: z.string(),
  MAILER_DEFAULT_PORT: z.coerce.number(),
  MAILER_DEFAULT_USER: z.string(),
  MAILER_DEFAULT_PASS: z.string(),
  MAILER_DEFAULT_SECURE: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true'),
  MAILER_DEFAULT_SENDER_NAME: z.string(),
  MAILER_DEFAULT_SENDER_EMAIL: z.email(),
});

export const mailerConfig = registerAs('mailer', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[mailer.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      host: data.MAILER_DEFAULT_HOST,
      port: data.MAILER_DEFAULT_PORT,
      user: data.MAILER_DEFAULT_USER,
      pass: data.MAILER_DEFAULT_PASS,
      secure: data.MAILER_DEFAULT_SECURE,
      sender: {
        name: data.MAILER_DEFAULT_SENDER_NAME,
        email: data.MAILER_DEFAULT_SENDER_EMAIL,
      },
    },
  };
});

export const MAILER_CONFIG_KEY = mailerConfig.KEY;

export type MailerConfig = ConfigType<typeof mailerConfig>;
