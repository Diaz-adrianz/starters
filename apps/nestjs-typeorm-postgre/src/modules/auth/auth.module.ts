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
import { DefaultMailerModule } from '../../lib/mailer/default/default-mailer.module';
import { DefaultRedisModule } from '../../lib/redis/default/default-redis.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(authConfig),
    IdentityModule,
    PassportModule,
    JwtModule,
    DefaultMailerModule,
    DefaultRedisModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
