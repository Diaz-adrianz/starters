import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultDataSourceFactory } from './datasource';
import { AppDataSource } from '../typeorm/app-data-source';
import { APP_CONFIG_KEY, appConfig, AppConfig } from '../../config/app.config';
import {
  DATABASE_CONFIG_KEY,
  databaseConfig,
  DatabaseConfig,
} from '../../config/database.config';
import { ConfigModule } from '@nestjs/config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DatabaseKeys } from '../database-keys.contant';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DatabaseKeys.DEFAULT,
      imports: [
        ConfigModule.forFeature(appConfig),
        ConfigModule.forFeature(databaseConfig),
      ],
      inject: [APP_CONFIG_KEY, DATABASE_CONFIG_KEY],
      useFactory: (appConfig: AppConfig, databaseConfig: DatabaseConfig) =>
        defaultDataSourceFactory(appConfig.mode, databaseConfig),
      dataSourceFactory: async (options) => {
        if (!options)
          throw new Error(
            `No DataSource options provided for "${DatabaseKeys.DEFAULT}"`,
          );
        return new AppDataSource(options).initialize();
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DefaultDatabaseModule {
  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    const inner = TypeOrmModule.forFeature(entities, DatabaseKeys.DEFAULT);
    return {
      module: DefaultDatabaseModule,
      imports: [inner],
      exports: [inner],
    };
  }
}
