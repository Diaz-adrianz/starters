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
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { User } from '../identity/entities/user.entity';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordCheckDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { ResourceScope } from '../../shared/classes/resource-scope.class';
import { UserService } from '../identity/resources/user/user.service';
import { StoreService } from '../../infra/store/store.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { type JwtRefreshAuthResult } from './interfaces/jwt-refresh.interface';
import { type JwtAccessAuthResult } from './interfaces/jwt-access.interface';
import { type Response } from 'express';
import {
  CookieKeys,
  CookiePath,
} from '../../shared/constants/cookie-keys.constant';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private authService: AuthService,
    private userService: UserService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Sign up handlers per strategy
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: 'Verification email sent' })
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
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(
      user,
      this.store.getOrThrow('device'),
    );
    this.setRefreshTokenCookie(res, result.tokens.refresh);
    return result;
  }

  // ================================================================
  // Access and refresh tokens rotation
  // ----------------------------------------------------------------
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(
    @ReqUser() refreshAuthResult: JwtRefreshAuthResult,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refresh(
      refreshAuthResult,
      this.store.get('device'),
    );
    this.setRefreshTokenCookie(res, result.tokens.refresh);
    return result;
  }

  // ================================================================
  // Sign out handlers
  // ----------------------------------------------------------------
  @ResSuccess({ message: 'Signed out' })
  @Post('/sign-out')
  async signOut(
    @ReqUser() { payload }: JwtAccessAuthResult,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(payload.session.id);
    this.clearRefreshTokenCookie(res);
    return;
  }

  @ResSuccess({ message: 'Signed out from all sessions' })
  @Post('/sign-out-all')
  async signOutAll(
    @ReqUser() { payload }: JwtAccessAuthResult,
    @Query('keepCurrent', new DefaultValuePipe(false), ParseBoolPipe)
    keepCurrent: boolean,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOutAll(
      payload.user.id,
      keepCurrent ? [payload.session.id] : [],
    );
    if (!keepCurrent) this.clearRefreshTokenCookie(res);
    return;
  }

  // ================================================================
  // Actor info
  // ----------------------------------------------------------------
  @Get('/me')
  async me(@ReqUser() { payload }: JwtAccessAuthResult) {
    const user = await this.userService.findOne(
      new ResourceScope([{ field: 'id', op: 'where', value: payload.user.id }]),
    );
    return { user };
  }

  // ================================================================
  // User verification
  // ----------------------------------------------------------------
  @Public()
  @ResSuccess({ message: 'Email verified' })
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
  @ResSuccess({ message: 'Code verified' })
  @Post('/reset-password-check')
  async resetPasswordCheck(@Body() dto: ResetPasswordCheckDto) {
    const { expiresAt } = await this.authService.resetPasswordCheck(dto);
    return { expiresAt };
  }

  @Public()
  @ResSuccess({ message: 'Password reset' })
  @Post('/reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(CookieKeys.REFRESH_TOKEN, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.authConfig.jwt.refresh.expire * 1000,
      path: CookiePath.REFRESH_TOKEN,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie(CookieKeys.REFRESH_TOKEN, {
      path: CookiePath.REFRESH_TOKEN,
    });
  }
}
