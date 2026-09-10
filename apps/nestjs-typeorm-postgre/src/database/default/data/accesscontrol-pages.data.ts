import { RolesData } from './roles.data';

export const PagesData: {
  name: string;
  description: string;
  roles: { name: string }[];
}[] = [
  {
    name: 'admin-dashboard',
    description: 'Admin dashboard page',
    roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.USER }],
  },
];
