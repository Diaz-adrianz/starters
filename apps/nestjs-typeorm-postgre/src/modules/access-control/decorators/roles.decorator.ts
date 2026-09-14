import { SetMetadata } from '@nestjs/common';

export interface RolesMetadata {
  roleNames: string[];
  forbiddenMessage?: string;
}

export const ROLES_METADATA_KEY = 'Roles';

export const Roles = (
  roleNames: RolesMetadata['roleNames'],
  options: Omit<RolesMetadata, 'roleNames'> = {},
) => {
  const metadata: RolesMetadata = { roleNames, ...options };
  return SetMetadata(ROLES_METADATA_KEY, metadata);
};
