import { LogoAdminPortal } from '@/assets/images';

export const Portals = {
  administrator: {
    name: 'Administrator',
    description: 'Manage users, roles, and system settings',
    logo: LogoAdminPortal,
    basePath: '/admin',
    ability: { action: 'access', subject: 'portal:administrator' },
  },
} as const;
