import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';

export interface RolesMetadata {
  roles: string[];
  forbiddenMessage?: string;
}

export const ROLES_METADATA = 'ROLES';

export const Roles = (
  roles: RolesMetadata['roles'],
  options: Omit<RolesMetadata, 'roles'> = {},
) => {
  const metadata: RolesMetadata = { roles, ...options };
  return applyDecorators(
    SetMetadata(ROLES_METADATA, metadata),
    UseGuards(RolesGuard),
  );
};
