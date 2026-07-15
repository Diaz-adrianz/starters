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
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestClientInfo } from '../../common/decorators/request-client-info.decorator';
import type { ClientInfo } from '../../common/interfaces/client-info.interface';
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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<EnvConfig>,
  ) {}

  // sign in methods
  @Public()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signInLocal(
    @RequestClientInfo() clientInfo: ClientInfo,
    @RequestUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceIdSecret = this.configService.getOrThrow('deviceId.secret', {
      infer: true,
    });
    clientInfo.deviceId =
      clientInfo.deviceId && clientInfo.deviceIdSignature
        ? verifyDeviceId(
            deviceIdSecret,
            clientInfo.deviceId,
            clientInfo.deviceIdSignature,
          )
        : null;

    if (!clientInfo.deviceId) {
      clientInfo.deviceId = generateDeviceId();
      res.cookie(
        CookieKeys.DEVICE_ID,
        signDeviceId(deviceIdSecret, clientInfo.deviceId),
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

    const result = await this.authService.signIn(user, clientInfo);
    this.saveRefreshToken(res, result.rt);
    return { user: result.user, tokens: { access: result.at } };
  }

  @Public()
  @Post('/refresh')
  async refreshSession(
    @RequestClientInfo() clientInfo: ClientInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!clientInfo.refreshToken)
      throw new UnauthorizedException('Missing token');
    const result = await this.authService.refreshSession(
      clientInfo.refreshToken,
    );
    this.saveRefreshToken(res, result.newRt);
    return { tokens: { access: result.at } };
  }

  @Public()
  @ResponseSuccess({ message: 'Signed out' })
  @Post('/sign-out')
  async signOut(
    @RequestClientInfo() clientInfo: ClientInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (clientInfo.refreshToken)
      await this.authService.signOut(clientInfo.refreshToken);
    res.clearCookie(CookieKeys.REFRESH_TOKEN, {
      path: CookiePath.REFRESH_TOKEN,
    });
    return;
  }

  @Get('/me')
  me(@RequestUser() session: Session) {
    return { session };
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
