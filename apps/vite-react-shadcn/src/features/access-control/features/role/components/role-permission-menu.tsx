import { RiProhibitedLine } from '@remixicon/react';
import type { RolePermission } from '../types/role.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type RolePermissionMenuItem = Pick<RolePermission, 'id'>;

function RolePermissionMenu({
  rolePermission,
  actions,
}: {
  rolePermission: RolePermissionMenuItem;
  actions?: {
    revoke?: (rolePermission: RolePermissionMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { revoke } = actions;

  return (
    <>
      {revoke && (
        <ResourceMenuButton
          subject="access-control:role"
          action="update"
          label="Revoke"
          Icon={RiProhibitedLine}
          destructive
          onClick={() => revoke(rolePermission)}
        />
      )}
    </>
  );
}

export { RolePermissionMenu };
