import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ReqClient } from '../../common/decorators/req-client.decorator';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import {
  generateDeviceId,
  signDeviceId,
  verifyDeviceId,
} from '../../common/utils/device-id.util';
import type { Response } from 'express';
import { CookieKeys, CookiePath } from '../../common/constants/cookie-keys';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { Client } from '../../common/classes/client.class';
import { UsersService } from '../users/users.service';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AuthContext } from '../../common/classes/auth-context.class';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService<EnvConfig>,
  ) {}

  @Public()
  @ResSuccess({ message: 'Check your inbox to verify your account' })
  @Post('sign-up')
  async signUpLocal(@Body() signUpLocalDto: SignUpLocalDto) {
    return this.authService.signUpLocal(signUpLocalDto);
  }

  // sign in methods
  @Public()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signInLocal(
    @ReqClient() client: Client,
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceIdSecret = this.configService.getOrThrow('deviceId.secret', {
      infer: true,
    });
    client.deviceId =
      client.deviceId && client.deviceIdSignature
        ? verifyDeviceId(
            deviceIdSecret,
            client.deviceId,
            client.deviceIdSignature,
          )
        : null;

    if (!client.deviceId) {
      client.deviceId = generateDeviceId();
      res.cookie(
        CookieKeys.DEVICE_ID,
        signDeviceId(deviceIdSecret, client.deviceId),
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge:
            this.configService.getOrThrow('deviceId.expire', { infer: true }) *
            1000,
          path: '/',
        },
      );
    }

    const result = await this.authService.signIn(user, client);
    this.saveRefreshToken(res, result.rt);
    return { user: result.user, tokens: { access: result.at } };
  }

  @Public()
  @Post('/refresh')
  async refreshSession(
    @ReqClient() client: Client,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!client.refreshToken) throw new UnauthorizedException('Missing token');
    const result = await this.authService.refreshSession(client.refreshToken);
    this.saveRefreshToken(res, result.newRt);
    return { tokens: { access: result.at } };
  }

  @Public()
  @ResSuccess({ message: 'Signed out' })
  @Post('/sign-out')
  async signOut(
    @ReqClient() client: Client,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (client.refreshToken)
      await this.authService.signOut(client.refreshToken);
    res.clearCookie(CookieKeys.REFRESH_TOKEN, {
      path: CookiePath.REFRESH_TOKEN,
    });
    return;
  }

  @ResSuccess({ message: 'Signed out all sessions' })
  @Post('/sign-out-all')
  async signOutAll(
    @ReqUser() { userId, sessionId }: AuthContext,
    @Res({ passthrough: true }) res: Response,
    @Query('keepCurrent', new DefaultValuePipe(false), ParseBoolPipe)
    keepCurrent: boolean,
  ) {
    await this.authService.signOutAll(userId, keepCurrent ? [sessionId] : []);
    if (!keepCurrent)
      res.clearCookie(CookieKeys.REFRESH_TOKEN, {
        path: CookiePath.REFRESH_TOKEN,
      });
    return;
  }

  @Get('/me')
  async me(@ReqUser() { userId }: AuthContext) {
    const user = await this.userService.findOne(userId);
    const sessions = await this.authService.findSessions(userId);
    return { user, sessions };
  }

  @Public()
  @ResSuccess({ message: 'Verification success' })
  @Get('/verify-email')
  verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    // TODO: redirect to client url
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @ResSuccess({ message: 'Reset link has been sent to your email' })
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Get('/reset-password-check')
  async resetPasswordCheck(@Query() resetPasswordCheck: ResetPasswordCheckDto) {
    // TODO: redirect to client url
    await this.authService.resetPasswordCheck(resetPasswordCheck);
    return;
  }

  @Public()
  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // utils
  private saveRefreshToken(res: Response, token: string) {
    res.cookie(CookieKeys.REFRESH_TOKEN, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge:
        this.configService.getOrThrow('jwt.refresh.expire', { infer: true }) *
        1000,
      path: CookiePath.REFRESH_TOKEN,
    });
  }
}
