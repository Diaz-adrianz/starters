import { DeviceType } from '../../../shared/constants/device-types.constant';

export const AuthEventName = {
  AUTH_SIGNIN: 'auth.signIn',
} as const;

export interface AuthEventPayload {
  [AuthEventName.AUTH_SIGNIN]: {
    userId: string;
    email: string;
    deviceId?: string;
    deviceType?: DeviceType;
    deviceName?: string;
    ip?: string;
    userAgent?: string;
  };
}
