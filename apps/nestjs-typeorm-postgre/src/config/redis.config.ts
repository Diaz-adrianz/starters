import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  REDIS_DEFAULT_HOST: z.string(),
  REDIS_DEFAULT_PORT: z.coerce.number(),
});

export const redisConfig = registerAs('redis', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[redis.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      host: data.REDIS_DEFAULT_HOST,
      port: data.REDIS_DEFAULT_PORT,
    },
  };
});

export const REDIS_CONFIG_KEY = redisConfig.KEY;

export type RedisConfig = ConfigType<typeof redisConfig>;
