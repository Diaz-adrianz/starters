import type { ComponentProps } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiMore2Line } from '@remixicon/react';
import { Can } from '@/components/shared/can';
import type { Role } from '../types/role.type';
import { Link } from 'react-router-dom';

type RoleMenuProps = ComponentProps<typeof DropdownMenu> & {
  role: Pick<Role, 'id' | 'name' | 'enabled'>;
  actions?: {
    onEdit?: (role: RoleMenuProps['role']) => void;
    onArchive?: (role: RoleMenuProps['role']) => void;
  };
};

function RoleMenu({ role, actions, ...props }: RoleMenuProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <RiMore2Line />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={`/admin/access/roles/${role.id}/accounts`}>Accounts</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/admin/access/roles/${role.id}/permissions`}>
              Permissions
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!!actions?.onEdit && (
            <Can I={'update'} a={'access-control:role'} passThrough>
              {({ isAllowed }) => (
                <DropdownMenuItem
                  disabled={!isAllowed}
                  onClick={() => actions.onEdit?.(role)}
                >
                  Edit
                </DropdownMenuItem>
              )}
            </Can>
          )}
          {!!actions?.onArchive && (
            <Can I={'archive'} a={'access-control:role'} passThrough>
              {({ isAllowed }) => (
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!isAllowed}
                  onClick={() => actions.onArchive?.(role)}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </Can>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { RoleMenu };
