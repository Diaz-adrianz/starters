import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { Profile } from '../types/profile.type';
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
import { Can } from '@/components/shared/can';
import { Link } from 'react-router-dom';

export const ProfileItem = ({
  profile,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  profile: Pick<Profile, 'firstName' | 'lastName' | 'gender'>;
  slotActions?: ReactNode;
}) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>
          {profile.firstName} {profile.lastName}
        </ItemTitle>
        <ItemDescription>{profile.gender}</ItemDescription>
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const ProfileItemSkeleton = ({
  ...props
}: ComponentProps<typeof Item>) => {
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
export const ProfileItemActionMenu = ({
  profile,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  profile: Pick<Profile, 'id' | 'userId'>;
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
            <Link to={'/admin/identity/accounts/' + profile.userId}>
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Can I={'update'} a={'identity:profile'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem disabled={!isAllowed}>Edit</DropdownMenuItem>
            )}
          </Can>
          <Can I={'archive'} a={'identity:profile'} passThrough>
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
