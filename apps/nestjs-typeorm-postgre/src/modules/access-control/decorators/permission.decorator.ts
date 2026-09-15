import { SetMetadata } from '@nestjs/common';

export interface PermissionMetadata {
  key: string;
  forbiddenMessage?: string;
}

export const PERMISSION_METADATA_KEY = 'Permission';

export const Permission = (
  key: string,
  options: Omit<PermissionMetadata, 'key'> = {},
) => {
  const parts = key.split(':');
  if (parts.length !== 3 || parts.some((part) => !part))
    throw new Error(
      `Invalid permission string "${key}" — expected "module:resource:action"`,
    );

  const metadata: PermissionMetadata = { key, ...options };
  return SetMetadata(PERMISSION_METADATA_KEY, metadata);
};
