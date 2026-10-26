import {
  RiArrowGoBackLine,
  RiDeleteBack2Line,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExpandDiagonalLine,
} from '@remixicon/react';
import type { Profile } from '../types/profile.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type ProfileMenuItem = Pick<Profile, 'id' | 'firstName'>;

function ProfileMenu({
  profile,
  actions,
}: {
  profile: ProfileMenuItem;
  actions?: {
    read?: string | ((profile: ProfileMenuItem) => void);
    update?: (profile: ProfileMenuItem) => void;
    archive?: (profile: ProfileMenuItem) => void;
    restore?: (profile: ProfileMenuItem) => void;
    delete?: (profile: ProfileMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { read, update, archive, restore, delete: del } = actions;

  return (
    <>
      {read && (
        <ResourceMenuButton
          subject="identity:profile"
          action="read"
          label="View"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={typeof read === 'function' ? () => read(profile) : undefined}
        />
      )}
      {update && (
        <ResourceMenuButton
          subject="identity:profile"
          action="update"
          label="Edit"
          Icon={RiEdit2Line}
          onClick={() => update(profile)}
        />
      )}
      {archive && (
        <ResourceMenuButton
          subject="identity:profile"
          action="archive"
          label="Remove"
          Icon={RiDeleteBinLine}
          destructive
          onClick={() => archive(profile)}
        />
      )}
      {restore && (
        <ResourceMenuButton
          subject="identity:profile"
          action="restore"
          label="Restore"
          Icon={RiArrowGoBackLine}
          onClick={() => restore(profile)}
        />
      )}
      {del && (
        <ResourceMenuButton
          subject="identity:profile"
          action="delete"
          label="Delete"
          Icon={RiDeleteBack2Line}
          destructive
          onClick={() => del(profile)}
        />
      )}
    </>
  );
}

export { ProfileMenu };
