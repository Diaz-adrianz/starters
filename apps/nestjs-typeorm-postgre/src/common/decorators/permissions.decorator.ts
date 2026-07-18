import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';

export interface PermissionsMetadata {
  permissions?: string[];
  strict?: boolean;
  message?: string;
}

export const PERMISSIONS_METADATA = 'PERMISSIONS';

export const Permissions = (
  permissions: string[] = [],
  strict: boolean = true,
  message: string = '',
) => {
  const metadata: PermissionsMetadata = { permissions, strict, message };
  return applyDecorators(
    SetMetadata(PERMISSIONS_METADATA, metadata),
    UseGuards(PermissionsGuard),
  );
};
