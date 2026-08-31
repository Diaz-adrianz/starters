import { RolesData } from './roles.data';

export const UsersData = [
  {
    username: 'superadmin',
    email: `superadmin@example.com`,
    roles: [{ name: RolesData.SUPERADMIN }],
  },
  {
    username: 'admin',
    email: `admin@example.com`,
    roles: [{ name: RolesData.ADMIN }],
  },
  {
    username: 'user',
    email: `user@example.com`,
    roles: [{ name: RolesData.USER }],
  },
];
