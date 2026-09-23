import { RolesData } from './roles.data';

export const PagesData: {
  name: string;
  description: string;
  roles: { name: string }[];
}[] = [
  {
    name: 'admin-app',
    description: 'Admin app',
    roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
  },
];
