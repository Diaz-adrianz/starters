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
import type { User } from '../types/user.type';

function UserMenu({
  user,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  user: Pick<User, 'id' | 'enabled'>;
  trigger?: ReactNode;
}) {
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
}

export { UserMenu };
