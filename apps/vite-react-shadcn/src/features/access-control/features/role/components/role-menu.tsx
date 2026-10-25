import type { ComponentProps, ReactNode } from 'react';
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

const RoleMenu = ({
  role,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  role: Pick<Role, 'id' | 'enabled'>;
  trigger?: ReactNode;
}) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size={'icon'}>
            <RiMore2Line />
          </Button>
        )}
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
          <DropdownMenuItem asChild>
            <Link to={`/admin/access/roles/${role.id}/pages`}>Pages</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Can I={'update'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem disabled={!isAllowed}>Edit</DropdownMenuItem>
            )}
          </Can>
          <Can I={'update'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem
                disabled={!isAllowed}
                variant={role.enabled ? 'destructive' : 'default'}
              >
                {role.enabled ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            )}
          </Can>
          <Can I={'archive'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem variant="destructive" disabled={!isAllowed}>
                Remove
              </DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { RoleMenu };
