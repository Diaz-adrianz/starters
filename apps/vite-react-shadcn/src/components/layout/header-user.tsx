import authStore from '@/stores/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AvatarImage, AvatarFallback, Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { RiAccountCircleLine, RiLogoutCircleLine } from '@remixicon/react';
import { getInitials } from '@/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSignOut } from '@/features/auth';

export const HeaderUser = () => {
  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status),
    authSignOut = authStore((s) => s.signOut);

  const signOut = useSignOut({
    silent: true,
    onSuccess: () => {
      authSignOut();
    },
  });

  if (authStatus === 'unauthenticated')
    return (
      <Button asChild>
        <Link to={'/auth/signin'}>Sign In</Link>
      </Button>
    );

  const onSignOut = () => {
    toast.promise(signOut.mutateAsync(), {
      loading: 'Signing you out...',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'} className="rounded-full">
          <Avatar>
            <AvatarImage src={authUser?.avatar ?? ''} alt="shadcn" />
            <AvatarFallback>
              {getInitials(authUser?.name ?? '-')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="grid gap-px">
            <span className="truncate text-base font-medium">
              {authUser?.name}
            </span>
            <span className="truncate text-xs">-</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={'/profile'}>
              <RiAccountCircleLine />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onSignOut} variant="destructive">
            <RiLogoutCircleLine />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
