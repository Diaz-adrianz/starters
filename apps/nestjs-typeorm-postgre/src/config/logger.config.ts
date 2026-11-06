import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  LOGGER_PATH: z.string().regex(/\/$/),
});

export const loggerConfig = registerAs('logger', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[logger.config] validation failed:\n- ${error.message}`);

  return {
    path: data.LOGGER_PATH,
  };
});

export const LOGGER_CONFIG_KEY = loggerConfig.KEY;

export type LoggerConfig = ConfigType<typeof loggerConfig>;
