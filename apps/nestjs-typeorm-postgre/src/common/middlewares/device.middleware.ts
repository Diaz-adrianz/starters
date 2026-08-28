import { Injectable, NestMiddleware } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { HeaderKeys } from '../../shared/constants/header-keys.constant';
import { Request } from 'express';
import { StoreService } from '../../infra/store/store.service';

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  constructor(private store: StoreService) {}

  use(req: Request, _: any, next: () => void) {
    const userAgent = req.headers[HeaderKeys.USER_AGENT] || '';

    const parser = new UAParser(userAgent),
      result = parser.getResult();

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    const deviceId = (req.headers[HeaderKeys.DEVICE_ID] as string) || '',
      deviceLabel = (req.headers[HeaderKeys.DEVICE_LABEL] as string) || '';

    this.store.set('device', {
      id: deviceId,
      label: deviceLabel,
      type: result.device.type || 'desktop',
      browser: result.browser.name,
      os: result.os.name,
      userAgent,
      ipAddress,
    });
    next();
  }
}
