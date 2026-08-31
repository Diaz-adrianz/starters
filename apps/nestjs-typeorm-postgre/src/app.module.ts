import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TypeormFilter } from './common/filters/typeorm.filter';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { S3Filter } from './common/filters/s3.filter';
import { NotificationModule } from './modules/notification/notification.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { LoggerModule } from './infra/logger/logger.module';
import { CacheModule } from './infra/cache/cache.module';
import { EventModule } from './infra/event/event.module';
import { IdentityModule } from './modules/identity/identity.module';
import { StoreModule } from './infra/store/store.module';
import { RequestMiddleware } from './common/middlewares/request.middleware';
import { DeviceMiddleware } from './common/middlewares/device.middleware';
import { JwtAccessGuard } from './modules/auth/guards/jwt-access.guard';
import { WebsocketModule } from './infra/websocket/websocket.module';

@Module({
  imports: [
    // Used for global app providers
    // ---------------------------------
    ConfigModule.forFeature(appConfig),

    // Infra
    // ---------------------------------
    CacheModule,
    LoggerModule,
    EventModule,
    StoreModule,
    WebsocketModule,

    // App modules
    // ---------------------------------
    IdentityModule,
    AuthModule,
    NotificationModule,
    AccessControlModule,
  ],
  providers: [
    // Guard providers
    // ---------------------------------
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
    consumer.apply(DeviceMiddleware).forRoutes('*');
  }
}
