import { DeviceType } from '../../../shared/constants/device-types.constant';

export interface EventPayload {
  'user.signIn': {
    userId: string;
    deviceId?: string;
    deviceType?: DeviceType;
    deviceName?: string;
    ip?: string;
    userAgent?: string;
  };
}

export type EventKey = keyof EventPayload;

export const EventName: Record<EventKey, EventKey> = {
  'user.signIn': 'user.signIn',
} as const;
