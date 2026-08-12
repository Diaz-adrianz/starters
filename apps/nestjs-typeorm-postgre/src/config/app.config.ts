import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

export const AppModes = ['development', 'production'] as const;
export type AppMode = (typeof AppModes)[number];

const schema = yup.object({
  APP_MODE: yup.string().oneOf(AppModes).required(),
  APP_PORT: yup.number().required(),
  APP_URL: yup
    .string()
    .test('is-url', 'Invalid URL', (value) => {
      try {
        new URL(value!);
        return true;
      } catch {
        return false;
      }
    })
    .required(),
});

export const appConfig = registerAs('app', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      mode: value.APP_MODE,
      port: value.APP_PORT,
      url: value.APP_URL,
    };
  } catch (error) {
    throw new Error(
      `[app.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const APP_CONFIG_KEY = appConfig.KEY;

export type AppConfig = ConfigType<typeof appConfig>;
