import {
  RiArrowGoBackLine,
  RiDeleteBack2Line,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExpandDiagonalLine,
} from '@remixicon/react';
import type { Role } from '../types/role.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type RoleMenuItem = Pick<Role, 'id' | 'name' | 'enabled'>;

function RoleMenu({
  role,
  actions,
}: {
  role: RoleMenuItem;
  actions?: {
    read?: string | ((role: RoleMenuItem) => void);
    update?: (role: RoleMenuItem) => void;
    archive?: (role: RoleMenuItem) => void;
    restore?: (role: RoleMenuItem) => void;
    delete?: (role: RoleMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { read, update, archive, restore, delete: del } = actions;

  return (
    <>
      {read && (
        <ResourceMenuButton
          subject="access-control:role"
          action="read"
          label="Read role"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={typeof read === 'function' ? () => read(role) : undefined}
        />
      )}
      {update && (
        <ResourceMenuButton
          subject="access-control:role"
          action="update"
          label="Update role"
          Icon={RiEdit2Line}
          onClick={() => update(role)}
        />
      )}
      {archive && (
        <ResourceMenuButton
          subject="access-control:role"
          action="archive"
          label="Remove role"
          Icon={RiDeleteBinLine}
          destructive
          onClick={() => archive(role)}
        />
      )}
      {restore && (
        <ResourceMenuButton
          subject="access-control:role"
          action="restore"
          label="Restore role"
          Icon={RiArrowGoBackLine}
          onClick={() => restore(role)}
        />
      )}
      {del && (
        <ResourceMenuButton
          subject="access-control:role"
          action="delete"
          label="Delete role"
          Icon={RiDeleteBack2Line}
          destructive
          onClick={() => del(role)}
        />
      )}
    </>
  );
}

export { RoleMenu };
