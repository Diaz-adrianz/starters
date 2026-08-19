import {
  BadGatewayException,
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
import { VerificationTokenService } from '../identity/resources/verification-token/verification-token.service';
import { VerificationToken } from '../identity/entities/verification-token.entity';
import { generateOtp } from '../../shared/utils/number.util';
import { VerificationTokenType } from '../identity/enums/verification-token-type.enum';
import { LoggerService } from '../../infra/logger/logger.service';
import { DeliveryService } from '../notification/resources/delivery/delivery.service';
import { DeliveryType } from '../notification/enums/delivery-type.enum';
import { DeliveryPriority } from '../notification/enums/delivery-priority.enum';
import { Channel } from '../notification/enums/channel.enum';
import { ResourceScope } from '../../shared/classes/resource-scope.class';

@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private event: EventService,
    private logger: LoggerService,
    private jwtService: JwtService,
    private userService: UserService,
    private verificationTokenService: VerificationTokenService,
    private deliveryService: DeliveryService,
    private redisService: DefaultRedisService,
  ) {}

  // ================================================================
  // Sign up
  // ----------------------------------------------------------------
  async signUpLocal(signUpLocalDto: SignUpLocalDto) {
    const existUser = await this.userService
      .findByUsernameOrEmail(signUpLocalDto.email)
      .catch(() => null);

    if (existUser && existUser.verifiedAt === null) {
      const existingToken = await this.verificationTokenService
        .findOne(
          new ResourceScope({
            where: `userId:${existUser.id};type:${VerificationTokenType.EMAIL_VERIFICATION}`,
            isnull: 'consumedAt',
          }),
        )
        .catch(() => undefined);

      if (
        !existingToken ||
        !existingToken.isWithinCooldown(
          this.authConfig.token.verification.expire * 1000,
        )
      ) {
        await this.sendEmailVerification(existUser, existingToken);
      }

      return existUser;
    }

    const user = await this.userService.create({
      username: signUpLocalDto.username,
      email: signUpLocalDto.email,
      password: signUpLocalDto.password,
      matchPassword: signUpLocalDto.matchPassword,
    });

    await this.sendEmailVerification(user);

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

    if (!revokeIds.length) return;

    await this.redisService.delMany((k) =>
      revokeIds.map((id) => k.session(id)),
    );
    await this.redisService.srem((k) => k.userSessions(userId), revokeIds);
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  async verifyEmail(dto: VerifyEmailDto) {
    const otpHash = sha256(dto.otp);

    const token = await this.verificationTokenService
      .findOne(
        new ResourceScope({
          where: `tokenHash:${otpHash};type:${VerificationTokenType.EMAIL_VERIFICATION}`,
          isnull: 'consumedAt',
        }),
      )
      .catch(() => null);

    if (!token || token.isExpired())
      throw new BadRequestException('Token invalid or expired');

    await this.userService.updateById(token.userId, { verifiedAt: new Date() });
    await this.verificationTokenService.updateById(token.id, {
      consumedAt: new Date(),
    });
  }

  // ================================================================
  // Password reset
  // ----------------------------------------------------------------
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService
      .findByUsernameOrEmail(dto.email)
      .catch(() => null);

    if (user) {
      const token = await this.verificationTokenService
        .findOne(
          new ResourceScope({
            where: `userId:${user.id};type:${VerificationTokenType.PASSWORD_RESET}`,
            isnull: 'consumedAt',
          }),
        )
        .catch(() => undefined);

      if (
        !token ||
        !token.isWithinCooldown(
          this.authConfig.token.resetPassword.expire * 1000,
        )
      )
        await this.sendEmailPasswordReset(user, token);
    }
  }

  async resetPasswordCheck(dto: ResetPasswordCheckDto) {
    const otpHash = sha256(dto.otp);

    const token = await this.verificationTokenService
      .findOne(
        new ResourceScope({
          where: `tokenHash:${otpHash};type:${VerificationTokenType.PASSWORD_RESET}`,
          isnull: 'consumedAt',
        }),
      )
      .catch(() => null);

    if (!token || token.isExpired())
      throw new BadRequestException('Token invalid or expired');

    return token;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const token = await this.resetPasswordCheck(resetPasswordDto);
    await this.userService.updatePassword(
      token.userId,
      resetPasswordDto.password,
    );
    await this.verificationTokenService.updateById(token.id, {
      consumedAt: new Date(),
    });
    await this.signOutAll(token.userId);
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
  private async sendEmailPasswordReset(
    user: User,
    existingToken?: VerificationToken,
  ) {
    const otp = generateOtp(6);
    const otpHash = sha256(otp);
    const expire = this.authConfig.token.resetPassword.expire;
    const expiresAt = new Date(Date.now() + expire * 1000);

    let token = existingToken;
    if (token)
      await this.verificationTokenService.updateById(token.id, {
        ...token,
        tokenHash: otpHash,
        expiresAt,
      });
    else
      token = await this.verificationTokenService.create({
        userId: user.id,
        type: VerificationTokenType.PASSWORD_RESET,
        tokenHash: otpHash,
        expiresAt,
      });

    try {
      await this.deliveryService.create({
        type: DeliveryType.TRANSACTIONAL,
        priority: DeliveryPriority.CRITICAL,
        templateKey: 'auth.password-reset',
        channels: [Channel.EMAIL],
        recipients: [
          {
            email: user.email,
            payload: { otp, expiresIn: `${expire / 60} minutes` },
          },
        ],
      });
    } catch (error) {
      this.logger.error(error);
    }

    await this.verificationTokenService.updateById(token.id, {
      sentAt: new Date(),
    });
  }

  private async sendEmailVerification(
    user: User,
    existingToken?: VerificationToken,
  ) {
    if (user.verifiedAt !== null)
      throw new BadRequestException('Account already verified');

    const otp = generateOtp(6);
    const otpHash = sha256(otp);
    const expire = this.authConfig.token.verification.expire;
    const expiresAt = new Date(Date.now() + expire * 1000);

    let token = existingToken;
    if (token)
      await this.verificationTokenService.updateById(token.id, {
        ...token,
        tokenHash: otpHash,
        expiresAt,
      });
    else
      token = await this.verificationTokenService.create({
        userId: user.id,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        tokenHash: otpHash,
        expiresAt,
      });

    try {
      await this.deliveryService.create({
        type: DeliveryType.TRANSACTIONAL,
        priority: DeliveryPriority.CRITICAL,
        templateKey: 'auth.email-verification',
        channels: [Channel.EMAIL],
        recipients: [
          {
            email: user.email,
            payload: { otp, expiresIn: `${expire / 60 / 60} hours` },
          },
        ],
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(
        "We couldn't send verification email right now. Please try again",
      );
    }

    await this.verificationTokenService.updateById(token.id, {
      sentAt: new Date(),
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
