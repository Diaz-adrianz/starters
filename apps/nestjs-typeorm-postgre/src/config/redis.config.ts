import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  REDIS_DEFAULT_HOST: yup.string().required(),
  REDIS_DEFAULT_PORT: yup.number().required(),
});

export const redisConfig = registerAs('redis', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        host: value.REDIS_DEFAULT_HOST,
        port: value.REDIS_DEFAULT_PORT,
      },
    };
  } catch (error) {
    throw new Error(
      `[redis.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const REDIS_CONFIG_KEY = redisConfig.KEY;

export type RedisConfig = ConfigType<typeof redisConfig>;
