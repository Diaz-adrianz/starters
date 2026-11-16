import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';
import { joinUrl } from '../shared/utils/string.util';

const schema = z.object({
  S3_DEFAULT_ENDPOINT: z.url(),
  S3_DEFAULT_PUBLIC_ENDPOINT: z.url(),
  S3_DEFAULT_REGION: z.string(),
  S3_DEFAULT_ACCESS_KEY_ID: z.string(),
  S3_DEFAULT_SECRET_ACCESS_KEY: z.string(),
  S3_DEFAULT_FORCE_PATH_STYLE: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true'),
  S3_DEFAULT_BUCKET: z.string(),
});

export const s3Config = registerAs('s3', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[s3.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      endpoint: data.S3_DEFAULT_ENDPOINT,
      publicEndpoint: data.S3_DEFAULT_PUBLIC_ENDPOINT,
      region: data.S3_DEFAULT_REGION,
      accessKeyId: data.S3_DEFAULT_ACCESS_KEY_ID,
      secretAccessKey: data.S3_DEFAULT_SECRET_ACCESS_KEY,
      forcePathStyle: data.S3_DEFAULT_FORCE_PATH_STYLE,
      bucket: data.S3_DEFAULT_BUCKET,
    },
  };
});

export const S3_CONFIG_KEY = s3Config.KEY;

export type S3Config = ConfigType<typeof s3Config>;

let globalValue: { default: { publicUrl: string } } | undefined;
export const s3ConfigGlobal = () => {
  if (!globalValue) {
    const config = s3Config();
    globalValue = {
      default: {
        publicUrl: joinUrl(
          config.default.publicEndpoint,
          config.default.bucket,
        ),
      },
    };
  }
  return globalValue;
};
