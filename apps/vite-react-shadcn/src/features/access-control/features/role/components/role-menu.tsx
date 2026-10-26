import { Button } from '@/components/ui/button';
import {
  RiArrowGoBackLine,
  RiDeleteBack2Line,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExpandDiagonalLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import { Can } from '@/components/shared/can';
import { Link } from 'react-router-dom';
import { cn } from 'cn';
import type { Role } from '../types/role.type';
import { WithTooltip } from '@/components/shared/with-tooltip';

function RoleMenuActionButton({
  action,
  Icon,
  label,
  destructive,
  to,
  onClick,
}: {
  action: string;
  Icon: RemixiconComponentType;
  label: string;
  destructive?: boolean;
  to?: string;
  onClick?: () => void;
}) {
  const className = cn(
    destructive && 'text-destructive hover:text-destructive'
  );
  return (
    <Can I={action} a="access-control:role">
      <WithTooltip text={label}>
        {to ? (
          <Button size="icon" variant="ghost" className={className} asChild>
            <Link to={to}>
              <Icon />
            </Link>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className={className}
            onClick={onClick}
          >
            <Icon />
          </Button>
        )}
      </WithTooltip>
    </Can>
  );
}

type RoleMenuItem = Pick<Role, 'id' | 'name' | 'enabled'>;

function RoleMenuActions({
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
        <RoleMenuActionButton
          action="read"
          label="Read role"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={typeof read === 'function' ? () => read(role) : undefined}
        />
      )}
      {update && (
        <RoleMenuActionButton
          action="update"
          label="Update role"
          Icon={RiEdit2Line}
          onClick={() => update(role)}
        />
      )}
      {archive && (
        <RoleMenuActionButton
          action="archive"
          label="Remove role"
          Icon={RiDeleteBinLine}
          destructive
          onClick={() => archive(role)}
        />
      )}
      {restore && (
        <RoleMenuActionButton
          action="restore"
          label="Restore role"
          Icon={RiArrowGoBackLine}
          onClick={() => restore(role)}
        />
      )}
      {del && (
        <RoleMenuActionButton
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

export { RoleMenuActions };
