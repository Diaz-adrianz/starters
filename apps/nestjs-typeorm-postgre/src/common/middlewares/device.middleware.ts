import { Injectable, NestMiddleware } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { Request } from 'express';
import { HeaderKeys } from '../../shared/constants/header-keys.constant';
import { StoreService } from '../../infra/store/store.service';
import {
  ClientType,
  ClientTypes,
  DeviceType,
  DeviceTypes,
} from '../../shared/constants/device.constant';

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  constructor(private store: StoreService) {}

  private header(req: Request, key: string): string | undefined {
    const value = req.headers[key];
    const str = Array.isArray(value) ? value[0] : value;
    return str?.trim().slice(0, 255);
  }

  use(req: Request, _: any, next: () => void) {
    const userAgent = this.header(req, HeaderKeys.USER_AGENT) || '';

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;

    const rawClientType = this.header(req, HeaderKeys.CLIENT_TYPE),
      clientType: ClientType = ClientTypes.includes(rawClientType as ClientType)
        ? (rawClientType as ClientType)
        : 'web';

    const deviceId = this.header(req, HeaderKeys.DEVICE_ID),
      headerDeviceLabel = this.header(req, HeaderKeys.DEVICE_LABEL);

    let deviceType: DeviceType | undefined,
      browser: string | undefined,
      os: string | undefined,
      osVersion: string | undefined;

    if (clientType === 'web') {
      const result = new UAParser(userAgent).getResult(),
        parsedType = result.device.type;

      deviceType =
        parsedType === 'tablet'
          ? 'tablet'
          : parsedType === 'mobile'
            ? 'mobile'
            : 'desktop';
      browser = result.browser.name;
      os = result.os.name;
      osVersion = result.os.version;
    } else {
      const rawDeviceType = this.header(req, HeaderKeys.DEVICE_TYPE);
      deviceType = DeviceTypes.includes(rawDeviceType as DeviceType)
        ? (rawDeviceType as DeviceType)
        : 'mobile';
      os =
        this.header(req, HeaderKeys.OS_NAME) ||
        (clientType === 'ios' ? 'iOS' : 'Android');
      osVersion = this.header(req, HeaderKeys.OS_VERSION);
    }

    const deviceLabel =
      headerDeviceLabel || [browser, os].filter(Boolean).join(' on ');

    this.store.set('device', {
      id: deviceId,
      label: deviceLabel,
      type: deviceType,
      client: clientType,
      browser,
      os,
      osVersion,
      userAgent,
      ipAddress,
    });
    next();
  }
}
