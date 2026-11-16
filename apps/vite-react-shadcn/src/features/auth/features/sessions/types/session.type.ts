export type SessionClientType = 'web' | 'ios' | 'android';

export type SessionClientDevice = 'desktop' | 'tablet' | 'mobile';

export type Session = {
  id: string;
  userId: string;
  clientId?: string | null;
  clientLabel?: string | null;
  clientType?: SessionClientType | null;
  clientDevice?: SessionClientDevice | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  lastUsedAt?: Date | null;
  isActive: boolean;
};
