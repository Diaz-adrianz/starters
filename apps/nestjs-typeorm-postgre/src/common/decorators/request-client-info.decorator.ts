import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CookieKeys } from '../../constants/cookie-keys';
import { extractSignedDeviceId } from '../utils/device-id.util';
import { ClientInfo } from '../interfaces/client-info.interface';

export const RequestClientInfo = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const signedDeviceId = req.cookies?.[CookieKeys.DEVICE_ID];
    const signedDeviceIdValues =
      typeof signedDeviceId == 'string'
        ? extractSignedDeviceId(signedDeviceId)
        : null;

    const info: ClientInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceIdSignature: signedDeviceIdValues?.signature,
      deviceId: signedDeviceIdValues?.deviceId,
      refreshToken: req.cookies?.[CookieKeys.REFRESH_TOKEN],
    };
    return info;
  },
);
