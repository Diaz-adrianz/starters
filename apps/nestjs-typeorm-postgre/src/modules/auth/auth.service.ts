import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { DefaultCacheService } from '../../cache/default/default-cache.service';
import { getRandomString, sha256 } from '../../shared/utils/string.util';
import { Session } from '../../common/interfaces/session.interface';
import { ClientInfo } from '../../common/interfaces/client-info.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
    private cacheService: DefaultCacheService,
  ) {}

  async signIn(user: User, clientInfo?: ClientInfo) {
    const sessionId = getRandomString(12);

    const atPayload: AccessTokenPayload = { sub: user.id, sid: sessionId };
    const rtPayload: RefreshTokenPayload = { sub: user.id, sid: sessionId };
    const [at, rt] = await Promise.all([
      this.signAccessToken(atPayload),
      this.signRefreshToken(rtPayload),
    ]);

    const session: Session = {
      id: user.id,
      username: user.username,
      rtHash: sha256(rt),
      ip: clientInfo?.ip,
      userAgent: clientInfo?.userAgent,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    await this.cacheService.set(
      (k) => k.session(sessionId),
      session,
      this.configService.getOrThrow('jwt.refresh.expire', {
        infer: true,
      }),
    );

    return {
      user: user,
      tokens: { access: at, refresh: rt },
    };
  }

  // auth validations
  async validateLocalStrategy(username: string, password: string) {
    const user = await this.usersService.findByUsernameOrEmail(username);

    if (!user.password)
      throw new UnauthorizedException(
        'This account is not registered with a password. Please try using another method.',
      );

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    this.checkUserActive(user);
    return user;
  }

  async findSession(sessionId: string) {
    const session = await this.cacheService.get<Session>((k) =>
      k.session(sessionId),
    );
    return session;
  }

  // utils
  private checkUserActive(user: User) {
    if (!user.isActive())
      throw new ForbiddenException('Account suspended or not verified.');
  }

  signAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(
      { sub: payload.sub, sid: payload.sid },
      {
        secret: this.configService.getOrThrow('jwt.access.secret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('jwt.access.expire', {
          infer: true,
        }),
        issuer: this.configService.getOrThrow('jwt.issuer', { infer: true }),
      },
    );
  }

  signRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.signAsync(
      { sub: payload.sub, sid: payload.sid },
      {
        secret: this.configService.getOrThrow('jwt.refresh.secret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('jwt.refresh.expire', {
          infer: true,
        }),
        issuer: this.configService.getOrThrow('jwt.issuer', { infer: true }),
      },
    );
  }
}
