import { Injectable, NestMiddleware } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { Request } from 'express';
import { HeaderKeys } from '../../shared/constants/header-keys.constant';
import { StoreService } from '../../infra/store/store.service';
import {
  ClientDevice,
  ClientDevices,
  ClientType,
  ClientTypes,
} from '../../shared/constants/client.constant';

@Injectable()
export class ClientMiddleware implements NestMiddleware {
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

    const clientId = this.header(req, HeaderKeys.CLIENT_ID),
      rawClientLabel = this.header(req, HeaderKeys.CLIENT_LABEL);

    let clientDevice: ClientDevice | undefined,
      browser: string | undefined,
      os: string | undefined,
      osVersion: string | undefined;

    if (clientType === 'web') {
      const result = new UAParser(userAgent).getResult(),
        parsedType = result.device.type;

      clientDevice =
        parsedType === 'tablet'
          ? 'tablet'
          : parsedType === 'mobile'
            ? 'mobile'
            : 'desktop';
      browser = result.browser.name;
      os = result.os.name;
      osVersion = result.os.version;
    } else {
      const rawDevice = this.header(req, HeaderKeys.CLIENT_DEVICE);
      clientDevice = ClientDevices.includes(rawDevice as ClientDevice)
        ? (rawDevice as ClientDevice)
        : 'mobile';
      os =
        this.header(req, HeaderKeys.OS_NAME) ||
        (clientType === 'ios' ? 'iOS' : 'Android');
      osVersion = this.header(req, HeaderKeys.OS_VERSION);
    }

    const clientLabel =
      rawClientLabel || [browser, os].filter(Boolean).join(' on ');

    this.store.set('client', {
      id: clientId,
      label: clientLabel,
      type: clientType,
      device: clientDevice,
      browser,
      os,
      osVersion,
      userAgent,
      ipAddress,
    });
    next();
  }
}
