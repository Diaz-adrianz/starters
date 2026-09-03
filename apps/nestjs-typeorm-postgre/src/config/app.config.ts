import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

export const AppModes = ['development', 'production'] as const;
export type AppMode = (typeof AppModes)[number];

const schema = z.object({
  APP_MODE: z.enum(AppModes),
  APP_PORT: z.coerce.number(),
  APP_ORIGIN: z.url(),
  APP_CLIENT_ORIGINS: z
    .string()
    .transform((val) => val.split(',').map((o) => o.trim()))
    .pipe(z.array(z.url()).min(1)),
});

export const appConfig = registerAs('app', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[app.config] validation failed:\n- ${error.message}`);

  return {
    mode: data.APP_MODE,
    port: data.APP_PORT,
    origin: data.APP_ORIGIN,
    clientOrigins: data.APP_CLIENT_ORIGINS,
  };
});

export const APP_CONFIG_KEY = appConfig.KEY;

export type AppConfig = ConfigType<typeof appConfig>;
