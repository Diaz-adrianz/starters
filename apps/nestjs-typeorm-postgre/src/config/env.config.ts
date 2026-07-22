import joi from 'joi';

const Modes = ['development', 'production'] as const;
export type Mode = (typeof Modes)[number];

export const envConfig = () => ({
  mode: process.env.MODE as Mode,
  port: parseInt(process.env.PORT ?? ''),
  server: {
    url: process.env.SERVER_URL,
  },
  token: {
    verification: {
      expire: parseInt(process.env.TOKEN_VERIFICATION_EXPIRE ?? ''),
    },
    resetPassword: {
      expire: parseInt(process.env.TOKEN_RESETPASSWORD_EXPIRE ?? ''),
    },
  },
  deviceId: {
    secret: process.env.DEVICE_ID_SECRET,
    expire: parseInt(process.env.DEVICE_ID_EXPIRE ?? ''),
  },
  database: {
    default: {
      host: process.env.DATABASE_DEFAULT_HOST,
      port: parseInt(process.env.DATABASE_DEFAULT_PORT ?? ''),
      username: process.env.DATABASE_DEFAULT_USERNAME,
      password: process.env.DATABASE_DEFAULT_PASSWORD,
      name: process.env.DATABASE_DEFAULT_NAME,
    },
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expire: parseInt(process.env.JWT_ACCESS_EXPIRE ?? ''),
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expire: parseInt(process.env.JWT_REFRESH_EXPIRE ?? ''),
    },
    issuer: process.env.JWT_ISSUER,
  },
  cache: {
    default: {
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT ?? ''),
    },
  },
  logger: {
    default: {
      path: process.env.LOGGER_DEFAULT_PATH,
    },
  },
  mail: {
    templatesPath: process.env.MAIL_TEMPLATES_PATH,
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? ''),
    sender: process.env.MAIL_SENDER,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    secure: process.env.MAIL_SECURE === 'true',
  },
});

export type EnvConfig = ReturnType<typeof envConfig>;

export const envConfigSchema = joi.object({
  MODE: joi
    .string()
    .valid(...Modes)
    .required(),
  PORT: joi.number().required(),
  SERVER_URL: joi.string().uri().required(),
  TOKEN_VERIFICATION_EXPIRE: joi.number().required(),
  TOKEN_RESETPASSWORD_EXPIRE: joi.number().required(),
  DEVICE_ID_SECRET: joi.string().required(),
  DEVICE_ID_EXPIRE: joi.number().required(),
  DATABASE_DEFAULT_HOST: joi.string().required(),
  DATABASE_DEFAULT_PORT: joi.number().required(),
  DATABASE_DEFAULT_USERNAME: joi.string().required(),
  DATABASE_DEFAULT_PASSWORD: joi.string().required(),
  DATABASE_DEFAULT_NAME: joi.string().required(),
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_ACCESS_EXPIRE: joi.number().required(),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRE: joi.number().required(),
  JWT_ISSUER: joi.string().required(),
  CACHE_HOST: joi.string().required(),
  CACHE_PORT: joi.number().required(),
  LOGGER_DEFAULT_PATH: joi.string().pattern(/\/$/).required(),
  MAIL_TEMPLATES_PATH: joi.string().required(),
  MAIL_HOST: joi.string().required(),
  MAIL_PORT: joi.number().required(),
  MAIL_SENDER: joi.string().required(),
  MAIL_USER: joi.string().required(),
  MAIL_PASS: joi.string().required(),
  MAIL_SECURE: joi.bool().required(),
});
