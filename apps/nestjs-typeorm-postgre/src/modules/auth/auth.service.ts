import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../identity/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';
import { EventService } from '../../infra/event/event.service';
import { UserService } from '../identity/resources/user/user.service';
import { HOUR } from '../../shared/utils/number.util';
import { LoggerService } from '../../infra/logger/logger.service';
import { Store } from '../../infra/store/store.interface';
import { SessionService } from './resources/session/session.service';
import {
  JwtRefreshAuthResult,
  JwtRefreshPayload,
} from './interfaces/jwt-refresh.interface';
import { randomUUID } from 'crypto';
import { JwtAccessPayload } from './interfaces/jwt-access.interface';
import {
  UserDisabledException,
  UserNoPasswordException,
  UserInvitedException,
} from '../identity/classes/exceptions/user.exception';
import { CacheService } from '../../infra/cache/cache.service';
import { UserStatus } from '../identity/enums/user-status.enum';

type UserCache = {
  id: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private event: EventService,
    private cache: CacheService,
    private logger: LoggerService,
    private jwtService: JwtService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  // ================================================================
  // Sign in
  // ----------------------------------------------------------------
  async signIn(user: User, device: NonNullable<Store['device']>) {
    const sessionId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ sid: sessionId, sub: user.id }),
      this.signRefreshToken({ sid: sessionId, sub: user.id }),
    ]);

    const session = await this.sessionService.create({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: this.sessionService.hashRefreshToken(refreshToken),
      deviceId: device.id,
      deviceLabel: device.label,
      deviceType: device.type,
      clientType: device.client,
      browser: device.browser,
      os: device.os,
      osVersion: device.osVersion,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      expiresAt: new Date(
        Date.now() + this.authConfig.jwt.refresh.expire * 1000,
      ),
      isActive: true,
      lastUsedAt: new Date(),
    });

    this.event.emit('auth.signIn', {
      userId: session.userId,
      email: user.email,
      device: {
        label: device.label,
        type: device.type,
        browser: device.browser,
        os: device.os,
        ipAddress: device.ipAddress,
      },
    });

    return {
      user,
      tokens: { access: accessToken, refresh: refreshToken },
    };
  }

  // ================================================================
  // Refresh
  // ----------------------------------------------------------------
  async refresh({ token, payload }: JwtRefreshAuthResult, _?: Store['device']) {
    const session = await this.sessionService.validate(
      payload.session.id,
      token,
    );

    // TODO: detect missmatch device as malicious activity

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken({ sid: session.id, sub: payload.user.id }),
      this.signRefreshToken({ sid: session.id, sub: payload.user.id }),
    ]);

    await this.sessionService.rotate(session.id, newRefreshToken);

    return {
      tokens: { access: accessToken, refresh: newRefreshToken },
    };
  }

  // ================================================================
  // Sign out
  // ----------------------------------------------------------------
  async signOut(sessionId: string) {
    const result = await this.sessionService.revokeById(sessionId);

    if (!result.affected)
      this.logger.debug(
        `Session ${sessionId} signOut not found or already revoked`,
        this.constructor.name,
      );
  }

  async signOutAll(userId: string, excludedSessionIds: string[] = []) {
    const result = await this.sessionService.revokeManyByUser(
      userId,
      excludedSessionIds,
    );

    this.logger.debug(
      `Signed out ${result.affected ?? 0} session(s) for user ${userId}`,
      this.constructor.name,
    );
  }

  // ================================================================
  // Strategy validation
  // ----------------------------------------------------------------
  async validateLocalStrategy(username: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(username);

    if (!user.password) throw new UserNoPasswordException();

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    this.validateUser(user);
    return user;
  }

  async validateJwtAccessStrategy(userId: string) {
    let userCache = await this.cache.get<UserCache>((k) => k.user(userId));

    if (!userCache) {
      this.logger.debug(
        `User cache missed for "${userId}"`,
        this.constructor.name,
      );
      const user = await this.userService.findById(userId).catch(() => null);
      if (!user) throw new UnauthorizedException();
      this.validateUser(user);

      userCache = { id: user.id, name: user.username };
      await this.cache.set((k) => k.user(userId), userCache, 1 * HOUR);
    }

    return userCache;
  }

  private validateUser(user: User) {
    if (user.status === UserStatus.INVITED) throw new UserInvitedException();
    if (user.status === UserStatus.DISABLED) throw new UserDisabledException();
  }

  invalidateUsers(users: { id: string }[]) {
    return this.cache.delMany((k) => users.map((user) => k.user(user.id)));
  }

  // ================================================================
  // Utils
  // ----------------------------------------------------------------
  private signAccessToken(payload: JwtAccessPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.authConfig.jwt.access.secret,
      expiresIn: this.authConfig.jwt.access.expire,
      issuer: this.authConfig.jwt.issuer,
    });
  }

  private signRefreshToken(payload: JwtRefreshPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.authConfig.jwt.refresh.secret,
      expiresIn: this.authConfig.jwt.refresh.expire,
      issuer: this.authConfig.jwt.issuer,
    });
  }
}
