import type { ComponentProps, ReactNode } from 'react';
import type { Permission } from '../types/permission.type';
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

const PermissionMenu = ({
  permission,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  permission: Pick<Permission, 'id' | 'enabled'>;
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
          <Can I={'update'} a={'access-control:permission'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem disabled={!isAllowed}>Edit</DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <Can I={'update'} a={'access-control:permission'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem
                variant={permission.enabled ? 'destructive' : 'default'}
                disabled={!isAllowed}
              >
                {permission.enabled ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { PermissionMenu };
