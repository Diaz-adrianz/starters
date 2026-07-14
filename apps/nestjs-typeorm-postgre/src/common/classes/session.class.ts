import { Exclude } from 'class-transformer';

export class Session {
  id: string;
  username: string;

  @Exclude({ toPlainOnly: true })
  rtHash: string;

  ip?: string;
  userAgent?: string;
  createdAt?: string;
  lastUsedAt?: string;
}
