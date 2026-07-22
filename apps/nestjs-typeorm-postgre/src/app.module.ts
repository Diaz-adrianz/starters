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
import { MailModule } from './common/mail/mail.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';

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

    UsersModule,
    AuthModule,
    DefaultCacheModule,
    DefaultLoggerModule,
    MailModule,
    RolesModule,
    PermissionsModule,
  ],
  providers: [
    // auth guard
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    // request validation
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

    // any error handler
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },

    // typeorm error handler
    {
      provide: APP_FILTER,
      useClass: TypeormFilter,
    },

    // response format
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
