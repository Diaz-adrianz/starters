import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { RoleUser } from '../types/role.type';
import { formatDate } from '@/utils/date';
import { Skeleton } from '@/components/ui/skeleton';
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

export const RoleUserItem = ({
  roleUser,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  roleUser: Pick<RoleUser, 'username' | 'userId' | 'createdAt'>;
  slotActions?: ReactNode;
}) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>{roleUser.username}</ItemTitle>
        <ItemDescription>
          Added at {formatDate(roleUser.createdAt, 'dd MMM yyyy HH:mm')}
        </ItemDescription>
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const RoleUserItemSkeleton = ({
  ...props
}: ComponentProps<typeof Item>) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>
          <Skeleton className="mb-1 h-5 w-24" />
        </ItemTitle>
        <ItemDescription className="flex gap-2">
          Added at <Skeleton className="h-5 w-24" />
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

// ======================================
// Actions
// --------------------------------------
export const RoleUserItemActionMenu = ({
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  roleUser: Pick<RoleUser, 'id'>;
}) => {
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
};
