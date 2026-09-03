import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  CACHE_TTL: z.string(),
  CACHE_MAX: z.coerce.number(),
});

export const cacheConfig = registerAs('cache', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[cache.config] validation failed:\n- ${error.message}`);

  return {
    ttl: data.CACHE_TTL,
    max: data.CACHE_MAX,
  };
});

export const CACHE_CONFIG_KEY = cacheConfig.KEY;

export type CacheConfig = ConfigType<typeof cacheConfig>;
