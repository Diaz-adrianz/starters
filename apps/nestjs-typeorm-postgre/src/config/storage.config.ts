import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  STORAGE_DEFAULT_ENDPOINT: yup.string().required(),
  STORAGE_DEFAULT_REGION: yup.string().required(),
  STORAGE_DEFAULT_ACCESS_KEY_ID: yup.string().required(),
  STORAGE_DEFAULT_SECRET_ACCESS_KEY: yup.string().required(),
  STORAGE_DEFAULT_FORCE_PATH_STYLE: yup.bool().required(),
  STORAGE_DEFAULT_BUCKET: yup.string().required(),
});

export const storageConfig = registerAs('storage', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        endpoint: value.STORAGE_DEFAULT_ENDPOINT,
        region: value.STORAGE_DEFAULT_REGION,
        accessKeyId: value.STORAGE_DEFAULT_ACCESS_KEY_ID,
        secretAccessKey: value.STORAGE_DEFAULT_SECRET_ACCESS_KEY,
        forcePathStyle: value.STORAGE_DEFAULT_FORCE_PATH_STYLE,
        bucket: value.STORAGE_DEFAULT_BUCKET,
      },
    };
  } catch (error) {
    throw new Error(
      `[storage.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const STORAGE_CONFIG_KEY = storageConfig.KEY;

export type StorageConfig = ConfigType<typeof storageConfig>;
