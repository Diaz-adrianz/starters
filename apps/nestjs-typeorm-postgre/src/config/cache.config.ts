import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  CACHE_TTL: yup.string().required(),
  CACHE_MAX: yup.number().required(),
});

export const cacheConfig = registerAs('cache', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      ttl: value.CACHE_TTL,
      max: value.CACHE_MAX,
    };
  } catch (error) {
    throw new Error(
      `[cache.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const CACHE_CONFIG_KEY = cacheConfig.KEY;

export type CacheConfig = ConfigType<typeof cacheConfig>;
