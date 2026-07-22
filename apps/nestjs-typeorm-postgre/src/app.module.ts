import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig, envConfig, envConfigSchema } from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultDataSourceFactory } from './database/default/datasource';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TypeormFilter } from './common/filters/typeorm.filter';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './common/guards/jwt.guard';
import { DefaultCacheModule } from './lib/cache/default/default-cache.module';
import { DefaultLoggerModule } from './lib/logger/default/default-logger.module';
import { DefaultMailerModule } from './lib/mailer/default/default-mailer.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DefaultStorageModule } from './lib/storage/default/default-storage.module';
import { S3Filter } from './common/filters/s3.filter';

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

    // caches
    DefaultCacheModule,

    // loggers
    DefaultLoggerModule,

    // mailers
    DefaultMailerModule,

    // storages
    DefaultStorageModule,

    // app modules
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
  ],
  providers: [
    // guards
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    // pipes
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

    // filters
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeormFilter,
    },
    {
      provide: APP_FILTER,
      useClass: S3Filter,
    },

    // interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
