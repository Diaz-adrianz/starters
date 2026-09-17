import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { User } from '../types/user.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/utils/date';
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
import {
  RiCheckboxCircleLine,
  RiIndeterminateCircleLine,
  RiMore2Line,
} from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Can } from '@/components/shared/can';

export const UserItem = ({
  user,
  slotBottom,
  slotRight,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  user: Pick<User, 'id' | 'username' | 'avatar' | 'enabled'>;
  slotBottom?: ReactNode;
  slotRight?: ReactNode;
  slotActions?: ReactNode;
}) => {
  return (
    <Item {...props}>
      <ItemMedia variant={'image'}>
        <Avatar>
          <AvatarImage src={user.avatar ?? ''} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{user.username}</ItemTitle>
        {slotBottom}
      </ItemContent>
      <ItemContent className="flex-row items-center gap-4">
        {user.enabled ? (
          <Badge>Active</Badge>
        ) : (
          <Badge variant={'secondary'}>Inactive</Badge>
        )}
        {slotRight}
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const UserItemSkeleton = ({ ...props }: ComponentProps<typeof Item>) => {
  return (
    <Item {...props}>
      <ItemMedia>
        <Skeleton className="size-10 rounded-full" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-6 w-32" />
      </ItemContent>
      <ItemContent className="flex-row items-center gap-4">
        <Skeleton className="h-6 w-16" />
      </ItemContent>
    </Item>
  );
};

// ======================================
// Slot contents
// --------------------------------------
export const UserItemEmail = ({
  email,
  ...props
}: ComponentProps<typeof ItemDescription> & {
  email: User['email'];
}) => {
  return <ItemDescription {...props}>{email}</ItemDescription>;
};

export const UserItemVerifiedBadge = ({
  verifiedAt,
  ...props
}: ComponentProps<typeof Badge> & {
  verifiedAt: User['verifiedAt'];
}) => {
  return verifiedAt ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge {...props} variant={'secondary'}>
          <RiCheckboxCircleLine className="text-green-500" />
          Verified
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>At {formatDate(verifiedAt, 'dd MMM yyyy HH:mm')}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Badge {...props} variant={'secondary'}>
      <RiIndeterminateCircleLine className="text-red-500" />
      Not verified
    </Badge>
  );
};

// ======================================
// Actions
// --------------------------------------
export const UserItemActionMenu = ({
  user,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  user: Pick<User, 'id' | 'enabled'>;
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
          <DropdownMenuLabel>Send email</DropdownMenuLabel>
          <DropdownMenuItem>Verification</DropdownMenuItem>
          <DropdownMenuItem>Password reset</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Can I={'update'} a={'identity:user'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem
                disabled={!isAllowed}
                variant={user.enabled ? 'destructive' : 'default'}
              >
                {user.enabled ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            )}
          </Can>
          <Can I={'archive'} a={'identity:user'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem disabled={!isAllowed} variant="destructive">
                Remove
              </DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
