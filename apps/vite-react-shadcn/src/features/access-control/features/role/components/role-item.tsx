import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { Role } from '../types/role.type';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Can } from '@/components/shared/can';

export const RoleItem = ({
  role,
  slotActions,
  ...props
}: Omit<ComponentProps<typeof Item>, 'role'> & {
  role: Pick<Role, 'id' | 'name' | 'enabled'>;
  slotActions?: ReactNode;
}) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>{role.name}</ItemTitle>
      </ItemContent>
      <ItemContent className="flex-row items-center gap-4">
        {role.enabled ? (
          <Badge>Active</Badge>
        ) : (
          <Badge variant={'secondary'}>Inactive</Badge>
        )}
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const RoleItemSkeleton = ({ ...props }: ComponentProps<typeof Item>) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <Skeleton className="h-6 w-32" />
      </ItemContent>
      <ItemContent>
        <Skeleton className="h-4 w-16" />
      </ItemContent>
    </Item>
  );
};

// ======================================
// Actions
// --------------------------------------
export const RoleItemActionMenu = ({
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
          <DropdownMenuItem>Accounts</DropdownMenuItem>
          <DropdownMenuItem>Permissions</DropdownMenuItem>
          <DropdownMenuItem>Pages</DropdownMenuItem>
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
