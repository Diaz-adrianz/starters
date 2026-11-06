import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  QUEUE_DEFAULT_REDIS_HOST: z.string(),
  QUEUE_DEFAULT_REDIS_PORT: z.coerce.number(),
});

export const queueConfig = registerAs('queue', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[queue.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      redis: {
        host: data.QUEUE_DEFAULT_REDIS_HOST,
        port: data.QUEUE_DEFAULT_REDIS_PORT,
      },
    },
  };
});

export const QUEUE_CONFIG_KEY = queueConfig.KEY;

export type QueueConfig = ConfigType<typeof queueConfig>;
