import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { User } from '../identity/entities/user.entity';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ReqClient } from '../../common/decorators/req-client.decorator';
import type { Response } from 'express';
import {
  CookieKeys,
  CookiePath,
} from '../../shared/constants/cookie-keys.constant';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { Client } from '../../shared/classes/client.class';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { Principal } from '../../shared/classes/principal.class';
import { ResourceScope } from '../../shared/classes/resource-scope.class';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';
import { UserService } from '../identity/resources/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private authService: AuthService,
    private userService: UserService,
  ) {}

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
    const result = await this.authService.signIn(user, client);
    if (client.isWeb()) this.saveRefreshToken(res, result.rt);
    return {
      user: result.user,
      tokens: {
        access: result.at,
        refresh: client.isMobile() ? result.rt : undefined,
      },
    };
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
    if (client.isWeb()) this.saveRefreshToken(res, result.newRt);
    return {
      tokens: {
        access: result.at,
        refresh: client.isMobile() ? result.newRt : undefined,
      },
    };
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

    if (client.isWeb())
      res.clearCookie(CookieKeys.REFRESH_TOKEN, {
        path: CookiePath.REFRESH_TOKEN,
      });
    return;
  }

  @ResSuccess({ message: 'Signed out all sessions' })
  @Post('/sign-out-all')
  async signOutAll(
    @ReqClient() client: Client,
    @ReqUser() { user, session }: Principal,
    @Res({ passthrough: true }) res: Response,
    @Query('keepCurrent', new DefaultValuePipe(false), ParseBoolPipe)
    keepCurrent: boolean,
  ) {
    await this.authService.signOutAll(user.id, keepCurrent ? [session.id] : []);
    if (!keepCurrent && client.isWeb())
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
    const scope = new ResourceScope({ where: `id:${principal.user.id}` });
    const user = await this.userService.findOne(scope);
    const sessions = await this.authService.findSessions(principal.user.id);
    return { user, sessions };
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: 'Your email has been verified' })
  @Post('/verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  // ================================================================
  // Reset password
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: "If that email exists, we've sent a reset code" })
  @Post('/forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @ResSuccess({ message: 'Code is valid' })
  @Post('/reset-password-check')
  async resetPasswordCheck(@Body() dto: ResetPasswordCheckDto) {
    const { expiresAt } = await this.authService.resetPasswordCheck(dto);
    return { expiresAt };
  }

  @Public()
  @ResSuccess({ message: 'Your password has been reset' })
  @Post('/reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
  private saveRefreshToken(res: Response, token: string) {
    res.cookie(CookieKeys.REFRESH_TOKEN, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.authConfig.jwt.refresh.expire * 1000,
      path: CookiePath.REFRESH_TOKEN,
    });
  }
}
