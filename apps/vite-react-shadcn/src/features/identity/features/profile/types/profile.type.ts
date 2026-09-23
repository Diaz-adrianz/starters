import type { User } from '../../user';

export type Profile = {
  id: string;
  userId: string;
  user: User;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bio: string | null;
  updatedAt: string;
};
