import type { User } from '@/features/identity';
import type { Role } from './role.type';

export type UserRole = {
  id: string;
  user: User;
  role: Role;
};
