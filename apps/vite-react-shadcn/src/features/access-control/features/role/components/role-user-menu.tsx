import type { ComponentProps } from 'react';
import type { RoleUser } from '../types/role.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiMore2Line } from '@remixicon/react';
import { Can } from '@/components/shared/can';

function RoleUserMenu({
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  roleUser: Pick<RoleUser, 'id'>;
}) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <RiMore2Line />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Can I={'update'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem variant="destructive" disabled={!isAllowed}>
                Delete
              </DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { RoleUserMenu };
