import type { Profile } from '../../profile/types/profile.type';

export type UserStatus = 'invited' | 'active' | 'disabled';

export type User = {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  avatar?: string | null;
  createdAt?: string | null;
  profile?: Profile | null;
};
