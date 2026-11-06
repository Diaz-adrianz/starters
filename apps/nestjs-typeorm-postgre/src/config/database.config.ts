import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_DEFAULT_HOST: z.string(),
  DATABASE_DEFAULT_PORT: z.coerce.number(),
  DATABASE_DEFAULT_USERNAME: z.string(),
  DATABASE_DEFAULT_PASSWORD: z.string(),
  DATABASE_DEFAULT_NAME: z.string(),
});

export const databaseConfig = registerAs('database', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[database.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      host: data.DATABASE_DEFAULT_HOST,
      port: data.DATABASE_DEFAULT_PORT,
      username: data.DATABASE_DEFAULT_USERNAME,
      password: data.DATABASE_DEFAULT_PASSWORD,
      name: data.DATABASE_DEFAULT_NAME,
    },
  };
});

export const DATABASE_CONFIG_KEY = databaseConfig.KEY;

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
