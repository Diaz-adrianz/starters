import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';

export interface PermissionMetadata {
  permission: string;
  module: string;
  resource: string;
  action: string;
  forbiddenMessage?: string;
}

export const PERMISSION_METADATA = 'PERMISSION';

export const Permission = (
  permission: string,
  options: Omit<
    PermissionMetadata,
    'permission' | 'module' | 'resource' | 'action'
  > = {},
) => {
  const parts = permission.split(':');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error(
      `Invalid permission string "${permission}" — expected "module:resource:action"`,
    );
  }

  const [module, resource, action] = parts;
  const metadata: PermissionMetadata = {
    permission,
    module,
    resource,
    action,
    ...options,
  };

  return applyDecorators(
    SetMetadata(PERMISSION_METADATA, metadata),
    UseGuards(PermissionGuard),
  );
};
