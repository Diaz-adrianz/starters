import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CookieKeys } from '../../constants/cookie-keys';
import { extractSignedDeviceId } from '../utils/device-id.util';
import { Client } from '../classes/client.class';

export const ReqClient = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const signedDeviceId = req.cookies?.[CookieKeys.DEVICE_ID];
  const signedDeviceIdValues =
    typeof signedDeviceId == 'string'
      ? extractSignedDeviceId(signedDeviceId)
      : null;

  const client = new Client();
  client.ip = req.ip;
  client.userAgent = req.headers['user-agent'];
  client.deviceIdSignature = signedDeviceIdValues?.signature;
  client.deviceId = signedDeviceIdValues?.deviceId;
  client.refreshToken = req.cookies?.[CookieKeys.REFRESH_TOKEN];
  return client;
});
