import joi from 'joi';

const Modes = ['development', 'production'] as const;
export type Mode = (typeof Modes)[number];

export const envConfig = () => ({
  mode: process.env.MODE as Mode,
  port: parseInt(process.env.PORT ?? ''),
  database: {
    default: {
      host: process.env.DATABASE_DEFAULT_HOST,
      port: parseInt(process.env.DATABASE_DEFAULT_PORT ?? ''),
      username: process.env.DATABASE_DEFAULT_USERNAME,
      password: process.env.DATABASE_DEFAULT_PASSWORD,
      name: process.env.DATABASE_DEFAULT_NAME,
    },
  },
});

export type EnvConfig = ReturnType<typeof envConfig>;

export const envConfigSchema = joi.object({
  MODE: joi
    .string()
    .valid(...Modes)
    .required(),
  PORT: joi.number().required(),
  DATABASE_DEFAULT_HOST: joi.string().required(),
  DATABASE_DEFAULT_PORT: joi.number().required(),
  DATABASE_DEFAULT_USERNAME: joi.string().required(),
  DATABASE_DEFAULT_PASSWORD: joi.string().required(),
  DATABASE_DEFAULT_NAME: joi.string().required(),
});
