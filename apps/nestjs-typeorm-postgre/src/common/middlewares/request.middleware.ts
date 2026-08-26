import { Injectable, NestMiddleware } from '@nestjs/common';
import { StoreService } from '../../infra/store/store.service';
import { Request, Response } from 'express';
import { HeaderKeys } from '../../shared/constants/header-keys.contant';
import { CookieKeys } from '../../shared/constants/cookie-keys.constant';
import {
  DeviceType,
  DeviceTypes,
} from '../../shared/constants/device-types.constant';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private store: StoreService) {}

  use(req: Request, _: Response, next: () => void) {
    const authHeader = req.headers[HeaderKeys.AUTHORIZATION];
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    const refreshToken = (req.cookies?.[CookieKeys.REFRESH_TOKEN] ??
      bearerToken ??
      req.body?.refreshToken) as string | undefined;
    const deviceType = req.headers[HeaderKeys.DEVICE_TYPE];

    this.store.set(
      'requestId',
      (req.headers[HeaderKeys.REQUEST_ID] as string) ||
        this.generateRequestId(),
    );
    this.store.set('client', {
      deviceId: req.headers[HeaderKeys.DEVICE_ID] as string,
      deviceType: DeviceTypes.includes(deviceType as DeviceType)
        ? (deviceType as DeviceType)
        : undefined,
      deviceName: req.headers[HeaderKeys.DEVICE_NAME] as string,
      ip: req.ip,
      userAgent: req.headers[HeaderKeys.USER_AGENT] as string,
      refreshToken: refreshToken,
    });

    next();
  }

  generateRequestId() {
    return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
}
