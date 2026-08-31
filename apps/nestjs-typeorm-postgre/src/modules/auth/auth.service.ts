import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../identity/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { sha256 } from '../../shared/utils/string.util';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';
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
  UserNotVerifiedException,
} from '../identity/classes/exceptions/user.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private event: EventService,
    private logger: LoggerService,
    private jwtService: JwtService,
    private userService: UserService,
    private verificationTokenService: VerificationTokenService,
    private deliveryService: DeliveryService,
    private sessionService: SessionService,
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
          new ResourceScope([
            { field: 'userId', op: 'where', value: existUser.id },
            {
              field: 'type',
              op: 'where',
              value: VerificationTokenType.EMAIL_VERIFICATION,
            },
            { field: 'consumedAt', op: 'isnull' },
          ]),
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
      browser: device.browser,
      os: device.os,
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      expiresAt: new Date(
        Date.now() + this.authConfig.jwt.refresh.expire * 1000,
      ),
      isActive: true,
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
    const result = await this.sessionService.revoke(
      new ResourceScope([{ field: 'id', op: 'where', value: sessionId }]),
    );

    if (!result.affected)
      this.logger.debug(
        `Session ${sessionId} signOut not found or already revoked`,
        this.constructor.name,
      );
  }

  async signOutAll(userId: string, excludedSessionIds: string[] = []) {
    const scope = new ResourceScope([
      { field: 'userId', op: 'where', value: userId },
    ]);

    if (excludedSessionIds.length)
      scope.add([{ field: 'id', op: 'nin', value: excludedSessionIds }]);

    const result = await this.sessionService.revoke(scope);

    this.logger.debug(
      `Signed out ${result.affected ?? 0} session(s) for user ${userId}`,
      this.constructor.name,
    );
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  async verifyEmail(dto: VerifyEmailDto) {
    const otpHash = sha256(dto.otp);

    const token = await this.verificationTokenService
      .findOne(
        new ResourceScope([
          { field: 'tokenHash', op: 'where', value: otpHash },
          {
            field: 'type',
            op: 'where',
            value: VerificationTokenType.EMAIL_VERIFICATION,
          },
          { field: 'consumedAt', op: 'isnull' },
        ]),
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
          new ResourceScope([
            { field: 'userId', op: 'where', value: user.id },
            {
              field: 'type',
              op: 'where',
              value: VerificationTokenType.PASSWORD_RESET,
            },
            { field: 'consumedAt', op: 'isnull' },
          ]),
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
        new ResourceScope([
          { field: 'tokenHash', op: 'where', value: otpHash },
          {
            field: 'type',
            op: 'where',
            value: VerificationTokenType.PASSWORD_RESET,
          },
          { field: 'consumedAt', op: 'isnull' },
        ]),
      )
      .catch(() => null);

    if (!token || token.isExpired())
      throw new BadRequestException('Token invalid or expired');

    return token;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const token = await this.resetPasswordCheck(resetPasswordDto);
    await this.userService.updatePasswordById(
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

    if (!user.password) throw new UserNoPasswordException();

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    this.validateUser(user);
    return user;
  }

  async validateJwtAccessStrategy(userId: string) {
    const user = await this.userService.findById(userId);
    this.validateUser(user);
    return user;
  }

  private validateUser(user: User) {
    if (!user.enabled) throw new UserDisabledException();
    if (!user.verifiedAt) throw new UserNotVerifiedException();
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
      this.logger.error(
        'Failed to send password reset email: ',
        error,
        this.constructor.name,
      );
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
      this.logger.error(
        'Failed to send verification email: ',
        error,
        this.constructor.name,
      );
      throw new BadGatewayException(
        "We couldn't send verification email right now. Please try again",
      );
    }

    await this.verificationTokenService.updateById(token.id, {
      sentAt: new Date(),
    });
  }

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
