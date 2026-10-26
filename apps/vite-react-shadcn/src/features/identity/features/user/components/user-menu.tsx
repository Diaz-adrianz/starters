import {
  RiArrowGoBackLine,
  RiDeleteBack2Line,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExpandDiagonalLine,
} from '@remixicon/react';
import type { User } from '../types/user.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type UserMenuItem = Pick<User, 'id' | 'username'>;

function UserMenu({
  user,
  actions,
}: {
  user: UserMenuItem;
  actions?: {
    read?: string | ((user: UserMenuItem) => void);
    update?: (user: UserMenuItem) => void;
    archive?: (user: UserMenuItem) => void;
    restore?: (user: UserMenuItem) => void;
    delete?: (user: UserMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { read, update, archive, restore, delete: del } = actions;

  return (
    <>
      {read && (
        <ResourceMenuButton
          subject="identity:user"
          action="read"
          label="View"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={typeof read === 'function' ? () => read(user) : undefined}
        />
      )}
      {update && (
        <ResourceMenuButton
          subject="identity:user"
          action="update"
          label="Edit"
          Icon={RiEdit2Line}
          onClick={() => update(user)}
        />
      )}
      {archive && (
        <ResourceMenuButton
          subject="identity:user"
          action="archive"
          label="Remove"
          Icon={RiDeleteBinLine}
          destructive
          onClick={() => archive(user)}
        />
      )}
      {restore && (
        <ResourceMenuButton
          subject="identity:user"
          action="restore"
          label="Restore"
          Icon={RiArrowGoBackLine}
          onClick={() => restore(user)}
        />
      )}
      {del && (
        <ResourceMenuButton
          subject="identity:user"
          action="delete"
          label="Delete"
          Icon={RiDeleteBack2Line}
          destructive
          onClick={() => del(user)}
        />
      )}
    </>
  );
}

export { UserMenu };
