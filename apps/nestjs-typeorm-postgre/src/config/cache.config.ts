import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  CACHE_DEFAULT_HOST: yup.string().required(),
  CACHE_DEFAULT_PORT: yup.number().required(),
});

export const cacheConfig = registerAs('cache', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        host: value.CACHE_DEFAULT_HOST,
        port: value.CACHE_DEFAULT_PORT,
      },
    };
  } catch (error) {
    throw new Error(
      `[cache.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const CACHE_CONFIG_KEY = cacheConfig.KEY;

export type CacheConfig = ConfigType<typeof cacheConfig>;
