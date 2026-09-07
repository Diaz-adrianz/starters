import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import type { Session } from '../types/session.type';
import { useSessions } from '../api/session.query';
import { Badge } from '@/components/ui/badge';
import { dateToNow } from '@/utils/date';
import { cn } from 'cn';
import {
  RiComputerLine,
  RiMore2Line,
  RiSmartphoneLine,
  RiTabletLine,
} from '@remixicon/react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// ======================================
// Context
// --------------------------------------
type SessionListContextProps = {
  sessions: Session[];
  isLoading: boolean;
};

const SessionListContext = createContext<SessionListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionList = () => {
  const context = useContext(SessionListContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const SessionList = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const { data, isLoading } = useSessions();

  return (
    <SessionListContext value={{ sessions: data?.items ?? [], isLoading }}>
      <div className={className} {...props}>
        {children}
      </div>
    </SessionListContext>
  );
};

// ======================================
// Item view
// --------------------------------------
export const SessionListItemGroup = ({
  children,
  separator = true,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (session: Session) => ReactNode;
  separator?: boolean;
}) => {
  const { sessions } = useSessionList();

  return (
    <ItemGroup {...props}>
      {sessions.map((s, i) => {
        return (
          <>
            {children(s)}
            {separator && i < sessions.length - 1 && <ItemSeparator />}
          </>
        );
      })}
    </ItemGroup>
  );
};

export const SessionListItem = ({
  session,
  slotRight,
  className,
  ...props
}: ComponentProps<typeof Item> & {
  session: Session;
  slotRight?: ReactNode;
}) => {
  return (
    <Item variant={'default'} className={cn('py-0', className)} {...props}>
      <ItemMedia variant={'icon'}>
        {session.deviceType === 'mobile' ? (
          <RiSmartphoneLine className="size-6" />
        ) : session.deviceType === 'tablet' ? (
          <RiTabletLine className="size-6" />
        ) : (
          <RiComputerLine className="size-6" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{session.deviceLabel || 'Unknown'}</ItemTitle>
        <ItemDescription>
          {session.os} · {session.browser}
        </ItemDescription>
        <ItemDescription>
          Last used {dateToNow(session.lastUsedAt)}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-row items-center gap-4">
        {session.isActive ? (
          <Badge>Active</Badge>
        ) : (
          <Badge variant={'secondary'}>Inactive</Badge>
        )}
        {slotRight}
      </ItemContent>
    </Item>
  );
};

// ======================================
// Row menu actions
// --------------------------------------
export const SessionListRowDropdownMenu = ({
  session,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  session: Pick<Session, 'id' | 'isActive'>;
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
        {session.isActive ? (
          <DropdownMenuItem variant="destructive">Terminate</DropdownMenuItem>
        ) : (
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
