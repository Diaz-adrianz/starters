import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TypeormFilter } from './common/filters/typeorm.filter';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './common/guards/jwt.guard';
import { S3Filter } from './common/filters/s3.filter';
import { NotificationModule } from './modules/notification/notification.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { LoggerModule } from './infra/logger/logger.module';
import { CacheModule } from './infra/cache/cache.module';

@Module({
  imports: [
    // Used for global app providers
    // ---------------------------------
    ConfigModule.forFeature(appConfig),

    // Infra
    // ---------------------------------
    CacheModule,
    LoggerModule,

    // App modules
    // ---------------------------------
    UserModule,
    AuthModule,
    NotificationModule,
    AccessControlModule,
  ],
  providers: [
    // Guard providers
    // ---------------------------------
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    // Pipe providers
    // ---------------------------------
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

    // Filter providers
    // ---------------------------------
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

    // Interceptor providers
    // ---------------------------------
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
