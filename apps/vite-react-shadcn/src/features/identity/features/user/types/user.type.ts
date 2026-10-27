import type { Profile } from '../../profile/types/profile.type';

export type User = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  avatar?: string | null;
  verifiedAt?: string | null;
  createdAt?: string | null;
  profile?: Profile | null;
};
