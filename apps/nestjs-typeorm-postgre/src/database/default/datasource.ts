import 'dotenv/config';
import { type DataSourceOptions, DataSource } from 'typeorm';
import { type PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';
import { SnakeNamingStrategy } from '../../shared/utils/typeorm-naming-strategy.util';
import { EnvConfig, Mode } from '../../config/env.config';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

const buildDataSource = (
  mode: Mode,
  options: PostgresConnectionCredentialsOptions,
): DataSourceOptions => ({
  type: 'postgres',
  host: options.host,
  port: options.port,
  username: options.username,
  password: options.password,
  database: options.database,
  entities: [join(__dirname, '../../modules/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, './migrations/*.{js,ts}')],
  migrationsRun: false,
  logging: mode !== 'production',
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});

const defaultDataSourceFactory = (configService: ConfigService<EnvConfig>) =>
  buildDataSource(configService.getOrThrow('mode'), {
    host: configService.getOrThrow('database.default.host', { infer: true }),
    port: configService.getOrThrow('database.default.port', { infer: true }),
    username: configService.getOrThrow('database.default.username', {
      infer: true,
    }),
    password: configService.getOrThrow('database.default.password', {
      infer: true,
    }),
    database: configService.getOrThrow('database.default.name', {
      infer: true,
    }),
  });

const defaultDataSource = new DataSource(
  buildDataSource(process.env.MODE as Mode, {
    host: process.env.DATABASE_DEFAULT_HOST,
    port: parseInt(process.env.DATABASE_DEFAULT_PORT ?? ''),
    username: process.env.DATABASE_DEFAULT_USERNAME,
    password: process.env.DATABASE_DEFAULT_PASSWORD,
    database: process.env.DATABASE_DEFAULT_NAME,
  }),
);

export { defaultDataSourceFactory };
export default defaultDataSource;
