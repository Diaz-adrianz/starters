import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  LOGGER_DEFAULT_PATH: yup.string().matches(/\/$/).required(),
});

export const loggerConfig = registerAs('logger', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        path: value.LOGGER_DEFAULT_PATH,
      },
    };
  } catch (error) {
    throw new Error(
      `[logger.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const LOGGER_CONFIG_KEY = loggerConfig.KEY;

export type LoggerConfig = ConfigType<typeof loggerConfig>;
