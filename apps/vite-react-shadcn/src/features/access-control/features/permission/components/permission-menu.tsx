import { RiEdit2Line } from '@remixicon/react';
import type { Permission } from '../types/permission.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type PermissionMenuItem = Pick<Permission, 'id' | 'description'>;

function PermissionMenu({
  permission,
  actions,
}: {
  permission: PermissionMenuItem;
  actions?: {
    update?: (permission: PermissionMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { update } = actions;

  return (
    <>
      {update && (
        <ResourceMenuButton
          subject="access-control:permission"
          action="update"
          label="Edit"
          Icon={RiEdit2Line}
          onClick={() => update(permission)}
        />
      )}
    </>
  );
}

export { PermissionMenu };
