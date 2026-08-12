import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  MAILER_DEFAULT_TEMPLATES_PATH: yup.string().required(),
  MAILER_DEFAULT_HOST: yup.string().required(),
  MAILER_DEFAULT_PORT: yup.number().required(),
  MAILER_DEFAULT_SENDER: yup.string().required(),
  MAILER_DEFAULT_USER: yup.string().required(),
  MAILER_DEFAULT_PASS: yup.string().required(),
  MAILER_DEFAULT_SECURE: yup.bool().required(),
});

export const mailerConfig = registerAs('mailer', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        templatesPath: value.MAILER_DEFAULT_TEMPLATES_PATH,
        host: value.MAILER_DEFAULT_HOST,
        port: value.MAILER_DEFAULT_PORT,
        sender: value.MAILER_DEFAULT_SENDER,
        user: value.MAILER_DEFAULT_USER,
        pass: value.MAILER_DEFAULT_PASS,
        secure: value.MAILER_DEFAULT_SECURE,
      },
    };
  } catch (error) {
    throw new Error(
      `[mailer.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const MAILER_CONFIG_KEY = mailerConfig.KEY;

export type MailerConfig = ConfigType<typeof mailerConfig>;
