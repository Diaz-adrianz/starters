import { DeviceType } from '../constants/device-types.constant';

export class Client {
  constructor(data?: Partial<Client>) {
    Object.assign(this, data);
  }

  deviceId?: string;
  deviceType?: DeviceType;
  deviceName?: string;
  ip?: string;
  userAgent?: string;
  refreshToken?: string | null;

  isWeb() {
    return this.deviceType == 'web';
  }

  isMobile() {
    return this.deviceType == 'android' || this.deviceType == 'ios';
  }
}
