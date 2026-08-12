import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  AUTH_TOKEN_VERIFICATION_EXPIRE: yup.number().required(),
  AUTH_TOKEN_RESETPASSWORD_EXPIRE: yup.number().required(),
  AUTH_JWT_ACCESS_SECRET: yup.string().required(),
  AUTH_JWT_ACCESS_EXPIRE: yup.number().required(),
  AUTH_JWT_REFRESH_SECRET: yup.string().required(),
  AUTH_JWT_REFRESH_EXPIRE: yup.number().required(),
  AUTH_JWT_ISSUER: yup.string().required(),
});

export const authConfig = registerAs('auth', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      token: {
        verification: {
          expire: value.AUTH_TOKEN_VERIFICATION_EXPIRE,
        },
        resetPassword: {
          expire: value.AUTH_TOKEN_RESETPASSWORD_EXPIRE,
        },
      },
      jwt: {
        access: {
          secret: value.AUTH_JWT_ACCESS_SECRET,
          expire: value.AUTH_JWT_ACCESS_EXPIRE,
        },
        refresh: {
          secret: value.AUTH_JWT_REFRESH_SECRET,
          expire: value.AUTH_JWT_REFRESH_EXPIRE,
        },
        issuer: value.AUTH_JWT_ISSUER,
      },
    };
  } catch (error) {
    throw new Error(
      `[auth.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const AUTH_CONFIG_KEY = authConfig.KEY;

export type AuthConfig = ConfigType<typeof authConfig>;
