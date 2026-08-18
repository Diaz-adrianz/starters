import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../identity/entities/user.entity';
import { JwtTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { DefaultRedisService } from '../../lib/redis/default/default-redis.service';
import { generateRandomString, sha256 } from '../../shared/utils/string.util';
import { Session } from '../../shared/classes/session.class';
import { Client } from '../../shared/classes/client.class';
import { plainToInstance } from 'class-transformer';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { DefaultMailerService } from '../../lib/mailer/default/default-mailer.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';
import { APP_CONFIG_KEY, type AppConfig } from '../../config/app.config';
import { EventService } from '../../infra/event/event.service';
import { UserService } from '../identity/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: DefaultRedisService,
    private mailerService: DefaultMailerService,
    private event: EventService,
  ) {}

  // ================================================================
  // Sign up
  // ----------------------------------------------------------------
  async signUpLocal(signUpLocalDto: SignUpLocalDto) {
    const existUser = await this.userService
      .findByUsernameOrEmail(signUpLocalDto.email)
      .catch(() => null);

    if (existUser && existUser.verifiedAt === null) {
      // TODO: push email delivery to queue
      if (
        !existUser.verificationSentAt ||
        Date.now() >=
          existUser.verificationSentAt.getTime() +
            this.authConfig.token.verification.expire * 1000
      )
        await this.sendEmailVerification(existUser).catch(() => {});

      return existUser;
    }

    const user = await this.userService.create({
      username: signUpLocalDto.username,
      email: signUpLocalDto.email,
      password: signUpLocalDto.password,
      matchPassword: signUpLocalDto.matchPassword,
    });

    // TODO: push email delivery to queue
    await this.sendEmailVerification(user).catch(() => {});

    return user;
  }

  // ================================================================
  // Sign in
  // ----------------------------------------------------------------
  async signIn(user: User, client: Client) {
    const sessionId = generateRandomString(16);

    const tokenPayload: JwtTokenPayload = { sub: user.id, sid: sessionId };
    const [at, rt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    const session: Session = {
      id: sessionId,
      userId: user.id,
      rtHash: sha256(rt),
      deviceId: client.deviceId,
      deviceType: client.deviceType,
      deviceName: client.deviceName,
      ip: client.ip,
      userAgent: client.userAgent,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    await this.saveSession(sessionId, session);

    this.event.emit('auth.signIn', {
      userId: session.userId,
      email: user.email,
      deviceId: session.deviceId,
      deviceType: session.deviceType,
      deviceName: session.deviceName,
      ip: session.ip,
    });

    return { user, at, rt };
  }

  // ================================================================
  // Sign out
  // ----------------------------------------------------------------
  async signOut(rt: string) {
    const rtPayload = await this.verifyRefreshToken(rt, true);
    await this.redisService.del((k) => k.session(rtPayload.sid));
    await this.redisService.srem(
      (k) => k.userSessions(rtPayload.sub),
      [rtPayload.sid],
    );
  }

  async signOutAll(userId: string, excepts: string[] = []) {
    const sessionIds = await this.redisService.smembers((k) =>
      k.userSessions(userId),
    );
    const revokeIds = excepts.length
      ? sessionIds.filter((sessionId) => !excepts.includes(sessionId))
      : sessionIds;

    await this.redisService.delMany((k) =>
      revokeIds.map((id) => k.session(id)),
    );
    await this.redisService.srem((k) => k.userSessions(userId), revokeIds);
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const tokenHash = sha256(verifyEmailDto.token);

    const userId = await this.redisService.get<string>((k) =>
      k.verifyToken(tokenHash),
    );
    if (!userId) throw new BadRequestException('Token invalid or expired');

    await this.redisService.del((k) => k.verifyToken(tokenHash));

    const user = await this.userService.findById(userId);
    await this.userService.updateById(user.id, {
      enabled: true,
      verifiedAt: new Date(),
      verificationSentAt: null,
    });
  }

  // ================================================================
  // Password reset
  // ----------------------------------------------------------------
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService
      .findByUsernameOrEmail(forgotPasswordDto.email)
      .catch(() => null);

    // TODO: push email delivery to queue
    if (
      user &&
      (!user.resetPasswordSentAt ||
        Date.now() >=
          user.resetPasswordSentAt.getTime() +
            this.authConfig.token.resetPassword.expire * 1000)
    )
      await this.sendResetPassword(user).catch(() => {});
  }

  async resetPasswordCheck(resetPasswordCheck: ResetPasswordCheckDto) {
    const tokenHash = sha256(resetPasswordCheck.token);

    const userId = await this.redisService.get<string>((k) =>
      k.resetPasswordToken(tokenHash),
    );
    if (!userId) throw new BadRequestException('Token invalid or expired');
    return { userId, tokenHash };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const cache = await this.resetPasswordCheck(resetPasswordDto);
    await this.userService.updatePassword(
      cache.userId,
      resetPasswordDto.password,
    );
    await this.signOutAll(cache.userId);
    await this.redisService.del((k) => k.resetPasswordToken(cache.tokenHash));
    await this.userService.updateById(cache.userId, {
      resetPasswordSentAt: null,
    });
  }

  // ================================================================
  // Strategy validation
  // ----------------------------------------------------------------
  async validateLocalStrategy(username: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(username);

    if (!user.password)
      throw new UnauthorizedException(
        'This account is not registered with a password. Please try using another method.',
      );

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    this.checkUserActive(user);
    return user;
  }

  // ================================================================
  // Session handlers
  // ----------------------------------------------------------------
  private async saveSession(sessionId: string, payload: Session) {
    await this.redisService.set((k) => k.session(sessionId), payload, {
      EX: this.authConfig.jwt.refresh.expire,
    });
    await this.redisService.sadd(
      (k) => k.userSessions(payload.userId),
      sessionId,
    );
  }

  async findSession(sessionId: string) {
    const session = await this.redisService.get<Session>((k) =>
      k.session(sessionId),
    );
    if (session) return plainToInstance(Session, session);
  }

  async findSessions(userId: string) {
    const sessionIds = await this.redisService.smembers((k) =>
      k.userSessions(userId),
    );
    const sessions = await this.redisService.getMany<Session>((k) =>
      sessionIds.map((sid) => k.session(sid)),
    );

    if (sessions) {
      const cleanSessions = sessions.filter((session) => !!session);
      return plainToInstance(Session, cleanSessions);
    } else return [];
  }

  // TODO: handle race condition + handle sliding RT expire
  async refreshSession(rt: string) {
    const tokenPayload = await this.verifyRefreshToken(rt);

    const session = await this.findSession(tokenPayload.sid);
    if (!session) throw new UnauthorizedException('Expired session');

    // TODO: log missmatch as suspicious activity
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

  // ================================================================
  // Utils
  // ----------------------------------------------------------------
  private async sendResetPassword(user: User) {
    const token = generateRandomString(12);
    const tokenHash = sha256(token);
    const link = `${this.appConfig.url}/auth/reset-password-check?token=${token}`;
    const expire = this.authConfig.token.resetPassword.expire;

    await this.redisService.set(
      (k) => k.resetPasswordToken(tokenHash),
      user.id,
      { EX: expire },
    );
    await this.mailerService.send({
      to: user.email,
      subject: 'Reset Password',
      content: {
        fileName: 'reset-password.html',
        payload: {
          link,
          expiresIn: expire / 60 + ' minutes',
        },
      },
    });
    await this.userService.updateById(user.id, {
      resetPasswordSentAt: new Date(),
    });
  }

  private async sendEmailVerification(user: User) {
    if (user.verifiedAt !== null)
      throw new BadRequestException('Account already verified');

    const token = generateRandomString(12);
    const tokenHash = sha256(token);
    const link = `${this.appConfig.url}/auth/verify-email?token=${token}`;
    const expire = this.authConfig.token.verification.expire;

    await this.redisService.set((k) => k.verifyToken(tokenHash), user.id, {
      EX: expire,
    });
    await this.mailerService.send({
      to: user.email,
      subject: 'Email Verification',
      content: {
        fileName: 'email-verification.html',
        payload: {
          link,
          expiresIn: expire / 60 / 60 + ' hours',
        },
      },
    });
    await this.userService.updateById(user.id, {
      verificationSentAt: new Date(),
    });
  }

  public checkUserActive(user: User) {
    if (!user.isActive())
      throw new ForbiddenException('Account suspended or not verified yet');
  }

  private signAccessToken(payload: JwtTokenPayload) {
    return this.jwtService.signAsync(
      { sub: payload.sub, sid: payload.sid },
      {
        secret: this.authConfig.jwt.access.secret,
        expiresIn: this.authConfig.jwt.access.expire,
        issuer: this.authConfig.jwt.issuer,
      },
    );
  }

  private signRefreshToken(payload: JwtTokenPayload) {
    return this.jwtService.signAsync(
      { sub: payload.sub, sid: payload.sid },
      {
        secret: this.authConfig.jwt.refresh.secret,
        expiresIn: this.authConfig.jwt.refresh.expire,
        issuer: this.authConfig.jwt.issuer,
      },
    );
  }

  private verifyRefreshToken(token: string, ignoreExpiration: boolean = false) {
    try {
      return this.jwtService.verifyAsync<JwtTokenPayload>(token, {
        secret: this.authConfig.jwt.refresh.secret,
        ignoreExpiration,
      });
    } catch {
      throw new UnauthorizedException('Expired session');
    }
  }
}
