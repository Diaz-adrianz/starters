import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig, envConfig, envConfigSchema } from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './modules/posts/posts.module';
import { defaultDataSourceFactory } from './database/default/datasource';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ValidationFilter } from './common/filters/validation.filter';
import { TypeormFilter } from './common/filters/typeorm.filter';

@Module({
  imports: [
    // configs
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema: envConfigSchema,
    }),

    // databases
    TypeOrmModule.forRootAsync({
      name: 'default',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) =>
        defaultDataSourceFactory(configService),
    }),

    PostsModule,
  ],
  providers: [
    // validation
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },

    // typeorm error handler
    {
      provide: APP_FILTER,
      useClass: TypeormFilter,
    },
  ],
})
export class AppModule {}
