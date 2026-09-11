import { SetMetadata } from '@nestjs/common';

export interface RolesMetadata {
  roles: string[];
  forbiddenMessage?: string;
}

export const ROLES_METADATA_KEY = 'Roles';

export const Roles = (
  roles: RolesMetadata['roles'],
  options: Omit<RolesMetadata, 'roles'> = {},
) => {
  const metadata: RolesMetadata = { roles, ...options };
  return SetMetadata(ROLES_METADATA_KEY, metadata);
};
