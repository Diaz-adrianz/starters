import { Logo } from '@/assets/images';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { cn } from 'cn';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
import {
  RiAccountCircleLine,
  RiApps2Fill,
  RiApps2Line,
  RiLogoutCircleLine,
  RiSettings4Line,
} from '@remixicon/react';
import { getInitials } from '@/utils/string';
import { Button } from '../ui/button';
import { useAuth } from '@/features/auth';
import { Portals } from '@/config/portals.config';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../ui/popover';
import { Item, ItemContent, ItemMedia, ItemTitle } from '../ui/item';
import { useAbility } from '@casl/react';

function Header({
  slotLeft,
  slotMiddle,
  slotRight,
  className,
  ...props
}: Omit<ComponentProps<'header'>, 'children'> & {
  slotLeft?: ReactNode;
  slotMiddle?: ReactNode;
  slotRight?: ReactNode;
}) {
  const scrollPos = useScrollPosition({ offsetTop: 30, offsetBottom: 20 });

  return (
    <header
      data-scroll-pos={scrollPos}
      className={cn(
        'fixed top-0 right-0 left-0 z-50 h-(--header-h) border-b border-sidebar-border bg-sidebar transition-all duration-300',
        'data-[scroll-pos=start]:bg-transparent',
        'data-[scroll-pos=start]:border-0',
        'data-[scroll-pos=down]:-translate-y-full',
        className
      )}
      {...props}
    >
      <div className="container mx-auto flex h-full items-center justify-between gap-8 px-4 *:flex *:items-center *:gap-4 md:px-6 lg:px-8">
        <div>{slotLeft}</div>
        <div>{slotMiddle}</div>
        <div>{slotRight}</div>
      </div>
    </header>
  );
}

function HeaderLogo() {
  return (
    <Link to={'/'} className="w-8">
      <img src={Logo} alt="" />
    </Link>
  );
}

function HeaderUser() {
  const { signOut } = useAuth();

  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  if (authStatus === 'unauthenticated')
    return (
      <Button asChild>
        <Link to={'/auth/signin'}>Sign In</Link>
      </Button>
    );

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
          <DropdownMenuItem asChild>
            <Link to={'/settings'}>
              <RiSettings4Line />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} variant="destructive">
            <RiLogoutCircleLine />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderPortals() {
  const ability = useAbility();

  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  const [open, setOpen] = useState(false);

  const portals = Object.values(Portals).filter((portal) =>
    portal.ability
      ? ability.can(portal.ability.action, portal.ability.subject)
      : true
  );

  if (authStatus === 'unauthenticated' || !authUser) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          {open ? <RiApps2Fill /> : <RiApps2Line />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full max-w-sm min-w-72">
        <PopoverHeader>
          <PopoverTitle>Apps</PopoverTitle>
          <PopoverDescription>
            {!portals.length && 'No apps available'}
          </PopoverDescription>
        </PopoverHeader>
        {portals.length > 0 && (
          <div className="grid grid-cols-2">
            {portals.map((portal) => (
              <Item className="flex-col" key={portal.name} asChild>
                <Link to={portal.basePath}>
                  <ItemMedia variant={'image'}>
                    <img src={portal.logo} alt={`${portal.name} logo`} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{portal.name}</ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { Header, HeaderLogo, HeaderUser, HeaderPortals };
