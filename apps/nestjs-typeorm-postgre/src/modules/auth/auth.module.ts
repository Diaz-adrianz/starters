import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../../config/app.config';
import { authConfig } from '../../config/auth.config';
import { DefaultRedisModule } from '../../lib/redis/default/default-redis.module';
import { IdentityModule } from '../identity/identity.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtModule,

    // modules
    IdentityModule,
    NotificationModule,

    // lib
    DefaultRedisModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
