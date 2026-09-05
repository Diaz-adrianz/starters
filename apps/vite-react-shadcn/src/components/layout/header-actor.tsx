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
import { Skeleton } from '../ui/skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSignOut } from '@/features/auth';

export const HeaderActor = () => {
  const authActor = authStore((s) => s.actor),
    authStatus = authStore((s) => s.status),
    authClear = authStore((s) => s.clear);

  const signOut = useSignOut({
    silent: true,
    onSuccess: () => {
      authClear();
    },
  });

  if (authStatus === 'loading')
    return <Skeleton className="size-10 rounded-full" />;

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
            <AvatarImage src={authActor?.avatar ?? ''} alt="shadcn" />
            <AvatarFallback>
              {getInitials(authActor?.name ?? '-')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="grid gap-px">
            <span className="truncate text-base font-medium">
              {authActor?.name}
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
