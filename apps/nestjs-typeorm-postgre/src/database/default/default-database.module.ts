import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from '../../config/env.config';
import { defaultDataSourceFactory } from './datasource';
import { AppDataSource } from '../typeorm/app-data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) =>
        defaultDataSourceFactory(configService),
      dataSourceFactory: async (options) => {
        if (!options)
          throw new Error('No DataSource options provided for "default"');
        return new AppDataSource(options).initialize();
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DefaultDatabaseModule {}
