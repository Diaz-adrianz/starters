import { RiUserUnfollowLine } from '@remixicon/react';
import type { RoleUser } from '../types/role.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type RoleUserMenuItem = Pick<RoleUser, 'id' | 'userId' | 'username'>;

function RoleUserMenu({
  roleUser,
  actions,
}: {
  roleUser: RoleUserMenuItem;
  actions?: {
    unAssign?: (roleUser: RoleUserMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { unAssign } = actions;

  return (
    <>
      {unAssign && (
        <ResourceMenuButton
          subject="access-control:role"
          action="update"
          label="Unassign"
          Icon={RiUserUnfollowLine}
          destructive
          onClick={() => unAssign(roleUser)}
        />
      )}
    </>
  );
}

export { RoleUserMenu };
