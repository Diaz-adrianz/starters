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
import { User } from '../user/entities/user.entity';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ReqClient } from '../../common/decorators/req-client.decorator';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import {
  generateDeviceId,
  signDeviceId,
  verifyDeviceId,
} from '../../shared/utils/device-id.util';
import type { Response } from 'express';
import {
  CookieKeys,
  CookiePath,
} from '../../shared/constants/cookie-keys.constant';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { Client } from '../../shared/classes/client.class';
import { UserService } from '../user/user.service';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { Principal } from '../../shared/classes/principal.class';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService<EnvConfig>,
  ) {}

  // ================================================================
  // Init
  // ----------------------------------------------------------------
  @Public()
  @Post('init')
  init(@ReqClient() client: Client, @Res({ passthrough: true }) res: Response) {
    this.saveDeviceId(res, client);
    return 'ok';
  }

  // ================================================================
  // Sign up handlers per strategy
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: 'Check your inbox to verify your account' })
  @Post('sign-up')
  async signUpLocal(@Body() signUpLocalDto: SignUpLocalDto) {
    return this.authService.signUpLocal(signUpLocalDto);
  }

  // ================================================================
  // Sign in
  // ----------------------------------------------------------------
  @Public()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signInLocal(
    @ReqClient() client: Client,
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.saveDeviceId(res, client);

    const result = await this.authService.signIn(user, client);
    this.saveRefreshToken(res, result.rt);
    return { user: result.user, tokens: { access: result.at } };
  }

  // ================================================================
  // Access and refresh tokens rotation
  // ----------------------------------------------------------------
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

  // ================================================================
  // Sign out handlers
  // ----------------------------------------------------------------
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
    @ReqUser() { user, session }: Principal,
    @Res({ passthrough: true }) res: Response,
    @Query('keepCurrent', new DefaultValuePipe(false), ParseBoolPipe)
    keepCurrent: boolean,
  ) {
    await this.authService.signOutAll(user.id, keepCurrent ? [session.id] : []);
    if (!keepCurrent)
      res.clearCookie(CookieKeys.REFRESH_TOKEN, {
        path: CookiePath.REFRESH_TOKEN,
      });
    return;
  }

  // ================================================================
  // Principal info
  // ----------------------------------------------------------------
  @Get('/me')
  async me(@ReqUser() principal: Principal) {
    const user = await this.userService.findById(principal.user.id);
    const sessions = await this.authService.findSessions(principal.user.id);
    return { user, sessions };
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: 'Verification success' })
  @Get('/verify-email')
  verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    // TODO: redirect to client url
    return this.authService.verifyEmail(verifyEmailDto);
  }

  // ================================================================
  // Reset password
  // ----------------------------------------------------------------
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

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
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

  private saveDeviceId(res: Response, client: Client) {
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
            this.configService.getOrThrow('deviceId.expire', {
              infer: true,
            }) * 1000,
          path: '/',
        },
      );
    }
  }
}
