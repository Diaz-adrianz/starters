import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { Permission } from '../types/permission.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiMore2Line } from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';

export const PermissionItem = ({
  permission,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  permission: Pick<Permission, 'id' | 'module' | 'description'>;
  slotActions?: ReactNode;
}) => {
  return (
    <Item {...props}>
      <ItemContent>
        <ItemTitle>{permission.description}</ItemTitle>
        <ItemDescription>{permission.module}</ItemDescription>
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const PermissionItemSkeleton = ({
  ...props
}: ComponentProps<typeof Item>) => {
  return (
    <Item {...props}>
      <ItemContent>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </ItemContent>
    </Item>
  );
};

// ======================================
// Actions
// --------------------------------------
export const PermissionItemActionMenu = ({
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
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
