import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  Post,
  Query,
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

@Controller('auth')
export class AuthController {
  constructor(
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
  async signInLocal(@ReqUser() user: User) {
    const result = await this.authService.signIn(
      user,
      this.store.getOrThrow('device'),
    );
    return result;
  }

  // ================================================================
  // Access and refresh tokens rotation
  // ----------------------------------------------------------------
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(@ReqUser() refreshAuthResult: JwtRefreshAuthResult) {
    const result = await this.authService.refresh(
      refreshAuthResult,
      this.store.get('device'),
    );
    return result;
  }

  // ================================================================
  // Sign out handlers
  // ----------------------------------------------------------------
  @ResSuccess({ message: 'Signed out' })
  @Post('/sign-out')
  async signOut(@ReqUser() { payload }: JwtAccessAuthResult) {
    await this.authService.signOut(payload.session.id);
    return;
  }

  @ResSuccess({ message: 'Signed out from all sessions' })
  @Post('/sign-out-all')
  async signOutAll(
    @ReqUser() { payload }: JwtAccessAuthResult,
    @Query('keepCurrent', new DefaultValuePipe(false), ParseBoolPipe)
    keepCurrent: boolean,
  ) {
    await this.authService.signOutAll(
      payload.user.id,
      keepCurrent ? [payload.session.id] : [],
    );
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
}
