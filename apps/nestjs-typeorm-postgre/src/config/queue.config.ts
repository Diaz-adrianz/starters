import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  QUEUE_DEFAULT_REDIS_HOST: yup.string().required(),
  QUEUE_DEFAULT_REDIS_PORT: yup.number().required(),
});

export const queueConfig = registerAs('queue', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        redis: {
          host: value.QUEUE_DEFAULT_REDIS_HOST,
          port: value.QUEUE_DEFAULT_REDIS_PORT,
        },
      },
    };
  } catch (error) {
    throw new Error(
      `[queue.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const QUEUE_CONFIG_KEY = queueConfig.KEY;

export type QueueConfig = ConfigType<typeof queueConfig>;
