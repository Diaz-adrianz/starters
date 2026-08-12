import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  DATABASE_DEFAULT_HOST: yup.string().required(),
  DATABASE_DEFAULT_PORT: yup.number().required(),
  DATABASE_DEFAULT_USERNAME: yup.string().required(),
  DATABASE_DEFAULT_PASSWORD: yup.string().required(),
  DATABASE_DEFAULT_NAME: yup.string().required(),
});

export const databaseConfig = registerAs('database', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        host: value.DATABASE_DEFAULT_HOST,
        port: value.DATABASE_DEFAULT_PORT,
        username: value.DATABASE_DEFAULT_USERNAME,
        password: value.DATABASE_DEFAULT_PASSWORD,
        name: value.DATABASE_DEFAULT_NAME,
      },
    };
  } catch (error) {
    throw new Error(
      `[database.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const DATABASE_CONFIG_KEY = databaseConfig.KEY;

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
