import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CookieKeys } from '../../shared/constants/cookie-keys.constant';
import {
  Client,
  DeviceType,
  deviceTypes,
} from '../../shared/classes/client.class';
import { HeaderKeys } from '../../shared/constants/header-keys.contant';

export const ReqClient = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();

  const authHeader = req.headers[HeaderKeys.AUTHORIZATION];
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  const refreshToken = (req.cookies?.[CookieKeys.REFRESH_TOKEN] ??
    bearerToken ??
    req.body?.refreshToken ??
    null) as string | null;

  const deviceType = req.headers[HeaderKeys.DEVICE_TYPE];

  return new Client({
    deviceId: req.headers[HeaderKeys.DEVICE_ID] as string | undefined,
    deviceType: deviceTypes.includes(deviceType as DeviceType)
      ? (deviceType as DeviceType)
      : undefined,
    deviceName: req.headers[HeaderKeys.DEVICE_NAME] as string | undefined,
    ip: req.ip,
    userAgent: req.headers[HeaderKeys.USER_AGENT],
    refreshToken,
  });
});
