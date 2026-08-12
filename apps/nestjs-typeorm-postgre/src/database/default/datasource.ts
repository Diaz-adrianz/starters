import 'dotenv/config';
import { type DataSourceOptions, DataSource } from 'typeorm';
import { type PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';
import { SnakeNamingStrategy } from '../../shared/utils/typeorm/naming-strategy.util';
import { join } from 'path';
import { SeederOptions } from 'typeorm-extension';
import { DatabaseConfig } from '../../config/database.config';
import { AppMode } from '../../config/app.config';

const buildDataSource = (
  mode: AppMode,
  options: PostgresConnectionCredentialsOptions,
): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: options.host,
  port: options.port,
  username: options.username,
  password: options.password,
  database: options.database,
  entities: [join(__dirname, '../../modules/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, './migrations/*.{js,ts}')],
  migrationsRun: false,
  logging: false,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  seeds: [join(__dirname, './seeds/*.{js,ts}')],
  seedTracking: false,
});

const defaultDataSourceFactory = (mode: AppMode, config: DatabaseConfig) =>
  buildDataSource(mode, {
    host: config.default.host,
    port: config.default.port,
    username: config.default.username,
    password: config.default.password,
    database: config.default.name,
  });

const defaultDataSource = new DataSource(
  buildDataSource(process.env.APP_MODE as AppMode, {
    host: process.env.DATABASE_DEFAULT_HOST,
    port: parseInt(process.env.DATABASE_DEFAULT_PORT ?? ''),
    username: process.env.DATABASE_DEFAULT_USERNAME,
    password: process.env.DATABASE_DEFAULT_PASSWORD,
    database: process.env.DATABASE_DEFAULT_NAME,
  }),
);

export { defaultDataSourceFactory };
export default defaultDataSource;
