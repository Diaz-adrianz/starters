import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  AUTH_TOKEN_VERIFICATION_EXPIRE: z.coerce.number(),
  AUTH_TOKEN_RESETPASSWORD_EXPIRE: z.coerce.number(),
  AUTH_JWT_ACCESS_SECRET: z.string(),
  AUTH_JWT_ACCESS_EXPIRE: z.coerce.number(),
  AUTH_JWT_REFRESH_SECRET: z.string(),
  AUTH_JWT_REFRESH_EXPIRE: z.coerce.number(),
  AUTH_JWT_ISSUER: z.string(),
});

export const authConfig = registerAs('auth', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[auth.config] validation failed:\n- ${error.message}`);

  return {
    token: {
      verification: {
        expire: data.AUTH_TOKEN_VERIFICATION_EXPIRE,
      },
      resetPassword: {
        expire: data.AUTH_TOKEN_RESETPASSWORD_EXPIRE,
      },
    },
    jwt: {
      access: {
        secret: data.AUTH_JWT_ACCESS_SECRET,
        expire: data.AUTH_JWT_ACCESS_EXPIRE,
      },
      refresh: {
        secret: data.AUTH_JWT_REFRESH_SECRET,
        expire: data.AUTH_JWT_REFRESH_EXPIRE,
      },
      issuer: data.AUTH_JWT_ISSUER,
    },
  };
});

export const AUTH_CONFIG_KEY = authConfig.KEY;

export type AuthConfig = ConfigType<typeof authConfig>;
