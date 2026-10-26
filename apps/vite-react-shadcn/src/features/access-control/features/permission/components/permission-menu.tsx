import { Button } from '@/components/ui/button';
import { RiEdit2Line, type RemixiconComponentType } from '@remixicon/react';
import { Can } from '@/components/shared/can';
import { Link } from 'react-router-dom';
import { cn } from 'cn';
import type { Permission } from '../types/permission.type';
import { WithTooltip } from '@/components/shared/with-tooltip';

function PermissionMenuActionButton({
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
    <Can I={action} a="access-control:permission">
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

type PermissionMenuItem = Pick<Permission, 'id' | 'description'>;

function PermissionMenuActions({
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
        <PermissionMenuActionButton
          action="update"
          label="Update permission"
          Icon={RiEdit2Line}
          onClick={() => update(permission)}
        />
      )}
    </>
  );
}

export { PermissionMenuActions };
