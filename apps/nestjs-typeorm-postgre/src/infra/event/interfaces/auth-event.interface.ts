export const AuthEventName = {
  AUTH_SIGNIN: 'auth.signIn',
} as const;

export interface AuthEventPayload {
  [AuthEventName.AUTH_SIGNIN]: {
    userId: string;
    email: string;
    device: {
      label?: string;
      type?: string;
      browser?: string;
      os?: string;
      ipAddress?: string;
    };
  };
}
