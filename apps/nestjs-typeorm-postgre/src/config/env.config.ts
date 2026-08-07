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
      host: process.env.CACHE_DEFAULT_HOST,
      port: parseInt(process.env.CACHE_DEFAULT_PORT ?? ''),
    },
  },
  logger: {
    default: {
      path: process.env.LOGGER_DEFAULT_PATH,
    },
  },
  mailer: {
    default: {
      templatesPath: process.env.MAILER_DEFAULT_TEMPLATES_PATH,
      host: process.env.MAILER_DEFAULT_HOST,
      port: parseInt(process.env.MAILER_DEFAULT_PORT ?? ''),
      sender: process.env.MAILER_DEFAULT_SENDER,
      user: process.env.MAILER_DEFAULT_USER,
      pass: process.env.MAILER_DEFAULT_PASS,
      secure: process.env.MAILER_DEFAULT_SECURE === 'true',
    },
  },
  storage: {
    default: {
      endpoint: process.env.STORAGE_DEFAULT_ENDPOINT,
      region: process.env.STORAGE_DEFAULT_REGION,
      accessKeyId: process.env.STORAGE_DEFAULT_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_DEFAULT_SECRET_ACCESS_KEY,
      forcePathStyle: process.env.STORAGE_DEFAULT_FORCE_PATH_STYLE === 'true',
      bucket: process.env.STORAGE_DEFAULT_BUCKET,
    },
  },
  firebase: {
    default: {
      serviceAccountPath: process.env.FIREBASE_DEFAULT_SERVICEACCOUNT_PATH,
    },
  },
});

export type EnvConfig = ReturnType<typeof envConfig>;

export const envConfigSchema = joi.object({
  // server
  MODE: joi
    .string()
    .valid(...Modes)
    .required(),
  PORT: joi.number().required(),
  SERVER_URL: joi.string().uri().required(),

  // tokens
  TOKEN_VERIFICATION_EXPIRE: joi.number().required(),
  TOKEN_RESETPASSWORD_EXPIRE: joi.number().required(),

  // databases
  DATABASE_DEFAULT_HOST: joi.string().required(),
  DATABASE_DEFAULT_PORT: joi.number().required(),
  DATABASE_DEFAULT_USERNAME: joi.string().required(),
  DATABASE_DEFAULT_PASSWORD: joi.string().required(),
  DATABASE_DEFAULT_NAME: joi.string().required(),

  // jwt auth
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_ACCESS_EXPIRE: joi.number().required(),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRE: joi.number().required(),
  JWT_ISSUER: joi.string().required(),

  // caches
  CACHE_DEFAULT_HOST: joi.string().required(),
  CACHE_DEFAULT_PORT: joi.number().required(),

  // loggers
  LOGGER_DEFAULT_PATH: joi.string().pattern(/\/$/).required(),

  // mailers
  MAILER_DEFAULT_TEMPLATES_PATH: joi.string().required(),
  MAILER_DEFAULT_HOST: joi.string().required(),
  MAILER_DEFAULT_PORT: joi.number().required(),
  MAILER_DEFAULT_SENDER: joi.string().required(),
  MAILER_DEFAULT_USER: joi.string().required(),
  MAILER_DEFAULT_PASS: joi.string().required(),
  MAILER_DEFAULT_SECURE: joi.bool().required(),

  // storages
  STORAGE_DEFAULT_ENDPOINT: joi.string().required(),
  STORAGE_DEFAULT_REGION: joi.string().required(),
  STORAGE_DEFAULT_ACCESS_KEY_ID: joi.string().required(),
  STORAGE_DEFAULT_SECRET_ACCESS_KEY: joi.string().required(),
  STORAGE_DEFAULT_FORCE_PATH_STYLE: joi.bool().required(),
  STORAGE_DEFAULT_BUCKET: joi.string().required(),

  // firebase
  FIREBASE_DEFAULT_SERVICEACCOUNT_PATH: joi.string().required(),
});
