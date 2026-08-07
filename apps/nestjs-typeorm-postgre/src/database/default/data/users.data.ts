import { RolesData } from './roles.data';

export const UsersData = [
  {
    username: 'Superadmin',
    email: `superadmin@example.com`,
    roles: [{ name: RolesData.SUPERADMIN }],
  },
  {
    username: 'Admin',
    email: `admin@example.com`,
    roles: [{ name: RolesData.ADMIN }],
  },
  {
    username: 'User',
    email: `user@example.com`,
    roles: [{ name: RolesData.USER }],
  },
];
