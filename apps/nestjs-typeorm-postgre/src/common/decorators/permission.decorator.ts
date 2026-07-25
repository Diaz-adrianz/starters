import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';

export interface PermissionMetadata {
  permission: string;
  forbiddenMessage?: string;
}

export const PERMISSION_METADATA = 'PERMISSION';

export const Permission = (
  permission: PermissionMetadata['permission'],
  options: Omit<PermissionMetadata, 'permission'> = {},
) => {
  const metadata: PermissionMetadata = { permission, ...options };
  return applyDecorators(
    SetMetadata(PERMISSION_METADATA, metadata),
    UseGuards(PermissionGuard),
  );
};
