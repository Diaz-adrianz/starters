import { ClientType } from '../../../shared/constants/client.constant';

export const AuthEventName = {
  AUTH_SIGNIN: 'auth.signIn',
} as const;

export interface AuthEventPayload {
  [AuthEventName.AUTH_SIGNIN]: {
    userId: string;
    email: string;
    date: Date;
    client: {
      label?: string;
      type?: ClientType;
      browser?: string;
      os?: string;
      osVersion?: string;
      ipAddress?: string;
    };
  };
}
