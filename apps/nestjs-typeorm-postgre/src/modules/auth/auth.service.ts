import {
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
import { getRandomString, sha256 } from '../../shared/utils/string.util';
import { Session } from '../../common/interfaces/session.interface';
import { ClientInfo } from '../../common/interfaces/client-info.interface';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { SignOutDto } from './dto/sign-out.dto';

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

    const tokenPayload: JwtTokenPayload = { sub: user.id, sid: sessionId };
    const [at, rt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
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

    await this.setSessions(user.id, 'add', sessionId);
    await this.saveSession(sessionId, session);

    return {
      user: user,
      tokens: { access: at, refresh: rt },
    };
  }

  async signOut(dto: SignOutDto) {
    const rtPayload = await this.verifyRefreshToken(dto.refreshToken, true);

    await this.cacheService.del((k) => k.session(rtPayload.sid));
    await this.setSessions(rtPayload.sub, 'remove', rtPayload.sid);
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
  private async setSessions(
    userId: string,
    op: 'add' | 'remove',
    sessionId: string,
  ) {
    let sessions =
      (await this.cacheService.get<string[]>((k) => k.userSessions(userId))) ??
      [];

    // TODO: track same deviceId, userAgent, and IP as suspicious activity
    if (op === 'add' && !sessions.includes(sessionId)) sessions.push(sessionId);
    else if (op === 'remove')
      sessions = sessions.filter((id) => id !== sessionId);

    await this.cacheService.set((k) => k.userSessions(userId), sessions);
  }

  private async saveSession(sessionId: string, payload: Session) {
    await this.cacheService.set(
      (k) => k.session(sessionId),
      payload,
      this.configService.getOrThrow('jwt.refresh.expire', {
        infer: true,
      }) * 1000,
    );
  }

  async findSession(sessionId: string) {
    const session = await this.cacheService.get<Session>((k) =>
      k.session(sessionId),
    );
    return session;
  }

  async refreshSession(dto: RefreshSessionDto) {
    const tokenPayload = await this.verifyRefreshToken(dto.refreshToken);

    const session = await this.findSession(tokenPayload.sid);
    if (!session) throw new UnauthorizedException('Expired session');

    // TODO: track missmatch RT, userAgent, and IP as suspicious activity
    const rtHash = sha256(dto.refreshToken);
    if (rtHash != session.rtHash)
      throw new UnauthorizedException('Expired session');

    const [at, newRt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    const newRtHash = sha256(newRt);
    const newSession: Session = { ...session, rtHash: newRtHash };

    await this.saveSession(tokenPayload.sid, newSession);
    return {
      tokens: { access: at, refresh: newRt },
    };
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
