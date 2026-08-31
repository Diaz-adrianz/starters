import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../../config/auth.config';
import { IdentityModule } from '../identity/identity.module';
import { NotificationModule } from '../notification/notification.module';
import { SessionService } from './resources/session/session.service';
import { SessionController } from './resources/session/session.controller';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Session } from './entities/session.entity';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    DefaultDatabaseModule.forFeature([Session]),
    PassportModule,
    JwtModule,

    // modules
    IdentityModule,
    NotificationModule,
  ],
  providers: [
    AuthService,
    SessionService,

    // strategies
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController, SessionController],
})
export class AuthModule {}
