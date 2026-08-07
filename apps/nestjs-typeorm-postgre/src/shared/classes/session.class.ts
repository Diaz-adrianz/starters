import { Exclude } from 'class-transformer';

export class Session {
  // user info
  id: string;
  userId: string;

  // token
  @Exclude({ toPlainOnly: true })
  rtHash: string;

  // device info
  ip?: string;
  userAgent?: string;

  // moments
  createdAt?: string;
  lastUsedAt?: string;
}
