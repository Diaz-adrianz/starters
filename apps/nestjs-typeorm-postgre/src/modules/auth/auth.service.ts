import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { DefaultCacheService } from '../../lib/cache/default/default-cache.service';
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
    private cacheService: DefaultCacheService,
    private mailerService: DefaultMailerService,
  ) {}

  async signUpLocal(signUpLocalDto: SignUpLocalDto) {
    const existUser = await this.userService
      .findByUsernameOrEmail(signUpLocalDto.email)
      .catch(() => null);

    if (existUser && existUser.verifiedAt === null) {
      // TODO: publish to jobs queue
      if (
        !existUser.verificationSentAt ||
        Date.now() >=
          existUser.verificationSentAt.getTime() +
            this.configService.getOrThrow('token.verification.expire', {
              infer: true,
            }) *
              1000
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

    // TODO: publish to jobs queue
    await this.sendEmailVerification(user).catch(() => {});

    return user;
  }

  async signIn(user: User, client: Client) {
    if (!client.deviceId)
      throw new BadRequestException('Device initialization required');

    const sessionId = sha256(`${user.id}:${client.deviceId}`);

    const tokenPayload: JwtTokenPayload = { sub: user.id, sid: sessionId };
    const [at, rt] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    const session: Session = {
      id: sessionId,
      userId: user.id,
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

  async signOutAll(userId: string, excepts: string[] = []) {
    if (excepts.length) {
      const sessions = await this.cacheService.findByPattern<Session>(
        (k) => k.session(userId),
        true,
      );
      const keys = sessions
        .map((s) => s.key)
        .filter((key) => !excepts.some((except) => key.endsWith(except)));
      if (keys.length) await this.cacheService.delMany(keys);
    } else await this.cacheService.delByPattern((k) => k.session(userId));
  }

  // verification
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const tokenHash = sha256(verifyEmailDto.token);

    const userId = await this.cacheService.get<string>((k) =>
      k.verifyToken(tokenHash),
    );
    if (!userId) throw new BadRequestException('Token invalid or expired');

    await this.cacheService.del((k) => k.verifyToken(tokenHash));

    const user = await this.userService.findById(userId);
    await this.userService.update(user.id, {
      enabled: true,
      verifiedAt: new Date(),
      verificationSentAt: null,
    });
  }

  // password settings
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService
      .findByUsernameOrEmail(forgotPasswordDto.email)
      .catch(() => null);

    // TODO: publish to jobs queue
    if (
      user &&
      (!user.resetPasswordSentAt ||
        Date.now() >=
          user.resetPasswordSentAt.getTime() +
            this.configService.getOrThrow('token.resetPassword.expire', {
              infer: true,
            }) *
              1000)
    )
      await this.sendResetPassword(user).catch(() => {});
  }

  async resetPasswordCheck(resetPasswordCheck: ResetPasswordCheckDto) {
    const tokenHash = sha256(resetPasswordCheck.token);

    const userId = await this.cacheService.get<string>((k) =>
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
    await this.cacheService.del((k) => k.resetPasswordToken(cache.tokenHash));
    await this.userService.update(cache.userId, {
      resetPasswordSentAt: null,
    });
  }

  // auth validations
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

  // session management
  private async saveSession(sessionId: string, payload: Session) {
    // TODO: track user sessions count. If exceed limit, send warning
    await this.cacheService.set(
      (k) => k.session(payload.userId, sessionId),
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
    if (session) return plainToInstance(Session, session);
  }

  async findSessions(userId: string) {
    const sessions = await this.cacheService.findByPattern<Session>((k) =>
      k.session(userId),
    );
    return plainToInstance(Session, sessions);
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
  private async sendResetPassword(user: User) {
    const token = generateRandomString(12);
    const tokenHash = sha256(token);
    const link = `${this.configService.getOrThrow('server.url', { infer: true })}/auth/reset-password-check?token=${token}`;
    const expire = this.configService.getOrThrow('token.resetPassword.expire', {
      infer: true,
    });

    await this.cacheService.set(
      (k) => k.resetPasswordToken(tokenHash),
      user.id,
      expire * 1000,
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
    await this.userService.update(user.id, {
      resetPasswordSentAt: new Date(),
    });
  }

  private async sendEmailVerification(user: User) {
    if (user.verifiedAt !== null)
      throw new BadRequestException('Account already verified');

    const token = generateRandomString(12);
    const tokenHash = sha256(token);
    const link = `${this.configService.getOrThrow('server.url', { infer: true })}/auth/verify-email?token=${token}`;
    const expire = this.configService.getOrThrow('token.verification.expire', {
      infer: true,
    });

    await this.cacheService.set(
      (k) => k.verifyToken(tokenHash),
      user.id,
      expire * 1000,
    );
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
    await this.userService.update(user.id, {
      verificationSentAt: new Date(),
    });
  }

  private checkUserActive(user: User) {
    if (!user.isActive())
      throw new ForbiddenException('Account suspended or not verified yet');
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

  private verifyRefreshToken(token: string, ignoreExpiration: boolean = false) {
    try {
      return this.jwtService.verifyAsync<JwtTokenPayload>(token, {
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
