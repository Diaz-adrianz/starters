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
import type { Profile } from '../types/profile.type';
import { Link } from 'react-router-dom';

const ProfileMenu = ({
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

export { ProfileMenu };
