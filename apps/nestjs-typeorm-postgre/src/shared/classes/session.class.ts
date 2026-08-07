import { Exclude } from 'class-transformer';
import { DeviceType } from './client.class';

export class Session {
  // user info
  id: string;
  userId: string;

  // token
  @Exclude({ toPlainOnly: true })
  rtHash: string;

  // device info
  deviceId?: string;
  deviceType?: DeviceType;
  deviceName?: string;
  ip?: string;
  userAgent?: string;

  // moments
  createdAt?: string;
  lastUsedAt?: string;
}
