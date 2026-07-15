import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { DefaultCacheService } from '../../cache/default/default-cache.service';
import { sha256 } from '../../shared/utils/string.util';
import { Session } from '../../common/classes/session.class';
import { Client } from '../../common/classes/client.class';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
    private cacheService: DefaultCacheService,
  ) {}

  async signIn(user: User, client: Client) {
    if (!client.deviceId) throw new BadRequestException('Device ID required');

    const sessionId = sha256(`${user.id}:${client.deviceId}`);

    const tokenPayload: JwtTokenPayload = { sub: user.id, sid: sessionId };
    const [at, rt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    const session: Session = {
      id: user.id,
      username: user.username,
      deviceId: client.deviceId,
      rtHash: sha256(rt),
      ip: client.ip,
      userAgent: client.userAgent,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    await this.saveSession(sessionId, session);

    return { user, at, rt };
  }

  async signOut(rt: string) {
    const rtPayload = await this.verifyRefreshToken(rt, true);
    await this.cacheService.del((k) => k.session(rtPayload.sub, rtPayload.sid));
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

  // session management
  private async saveSession(sessionId: string, payload: Session) {
    // TODO: track user sessions count. If exceed limit, send warning
    await this.cacheService.set(
      (k) => k.session(payload.id, sessionId),
      payload,
      this.configService.getOrThrow('jwt.refresh.expire', {
        infer: true,
      }) * 1000,
    );
  }

  async findSession(userId: string, sessionId: string) {
    const session = await this.cacheService.get<Session>((k) =>
      k.session(userId, sessionId),
    );
    return session;
  }

  async refreshSession(rt: string) {
    const tokenPayload = await this.verifyRefreshToken(rt);

    const session = await this.findSession(tokenPayload.sub, tokenPayload.sid);
    if (!session) throw new UnauthorizedException('Expired session');

    // TODO: track missmatch RT hash, deviceId, userAgent, and IP as suspicious activity
    const rtHash = sha256(rt);
    if (rtHash != session.rtHash)
      throw new UnauthorizedException('Expired session');

    const [at, newRt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    const newRtHash = sha256(newRt);
    const newSession: Session = {
      ...session,
      rtHash: newRtHash,
      lastUsedAt: new Date().toISOString(),
    };

    await this.saveSession(tokenPayload.sid, newSession);
    return { at, newRt };
  }

  // utils
  private checkUserActive(user: User) {
    if (!user.isActive())
      throw new ForbiddenException('Account suspended or not verified.');
  }

  private signAccessToken(payload: JwtTokenPayload) {
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

  private signRefreshToken(payload: JwtTokenPayload) {
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

  private async verifyRefreshToken(
    token: string,
    ignoreExpiration: boolean = false,
  ) {
    try {
      return await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
        secret: this.configService.getOrThrow('jwt.refresh.secret', {
          infer: true,
        }),
        ignoreExpiration,
      });
    } catch {
      throw new UnauthorizedException('Expired session');
    }
  }
}
