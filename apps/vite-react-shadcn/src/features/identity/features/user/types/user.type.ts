import type { UserRole } from '@/features/access-control';

export type User = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  avatar?: string | null;
  verifiedAt?: string | null;
  createdAt?: string | null;

  roles?: UserRole[];
};
