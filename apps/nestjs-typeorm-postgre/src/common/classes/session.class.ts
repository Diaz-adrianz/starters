import { Exclude } from 'class-transformer';

export class Session {
  id: string;
  userId: string;
  username: string;

  @Exclude({ toPlainOnly: true })
  deviceId: string;

  @Exclude({ toPlainOnly: true })
  rtHash: string;

  ip?: string;
  userAgent?: string;
  createdAt?: string;
  lastUsedAt?: string;
}
