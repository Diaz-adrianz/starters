import {
  Controller,
  Get,
  Post,
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
import type { Session } from '../../common/classes/session.class';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import {
  generateDeviceId,
  signDeviceId,
  verifyDeviceId,
} from '../../common/utils/device-id.util';
import type { Response } from 'express';
import { CookieKeys, CookiePath } from '../../constants/cookie-keys';
import { ResponseSuccess } from '../../common/decorators/response-success.decorator';
import { Client } from '../../common/classes/client.class';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService<EnvConfig>,
  ) {}

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
  @ResponseSuccess({ message: 'Signed out' })
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

  @ResponseSuccess({ message: 'Signed out all sessions' })
  @Post('/sign-out-all')
  async signOutAll(
    @ReqUser() user: Session,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOutAll(user.id);
    res.clearCookie(CookieKeys.REFRESH_TOKEN, {
      path: CookiePath.REFRESH_TOKEN,
    });
    return;
  }

  @Get('/me')
  async me(@ReqUser() session: Session) {
    const user = await this.userService.findOne(session.id);
    const sessions = await this.authService.findSessions(session.id);
    return { user, session, sessions };
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
