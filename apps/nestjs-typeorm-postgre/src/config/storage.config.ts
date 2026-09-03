import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  STORAGE_DEFAULT_ENDPOINT: z.string(),
  STORAGE_DEFAULT_REGION: z.string(),
  STORAGE_DEFAULT_ACCESS_KEY_ID: z.string(),
  STORAGE_DEFAULT_SECRET_ACCESS_KEY: z.string(),
  STORAGE_DEFAULT_FORCE_PATH_STYLE: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true'),
  STORAGE_DEFAULT_BUCKET: z.string(),
});

export const storageConfig = registerAs('storage', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[storage.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      endpoint: data.STORAGE_DEFAULT_ENDPOINT,
      region: data.STORAGE_DEFAULT_REGION,
      accessKeyId: data.STORAGE_DEFAULT_ACCESS_KEY_ID,
      secretAccessKey: data.STORAGE_DEFAULT_SECRET_ACCESS_KEY,
      forcePathStyle: data.STORAGE_DEFAULT_FORCE_PATH_STYLE,
      bucket: data.STORAGE_DEFAULT_BUCKET,
    },
  };
});

export const STORAGE_CONFIG_KEY = storageConfig.KEY;

export type StorageConfig = ConfigType<typeof storageConfig>;
