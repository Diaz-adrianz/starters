import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { type ComponentProps, type ReactNode } from 'react';
import type { Session } from '../types/session.type';
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
import { useRemoveSession, useRevokeSession } from '../api/session.mutation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export const SessionItem = ({
  session,
  slotRight,
  className,
  ...props
}: ComponentProps<typeof Item> & {
  session: Session;
  slotRight?: ReactNode;
}) => {
  return (
    <Item variant={'default'} className={cn(className)} {...props}>
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

export const SessionItemSkeleton = ({
  className,
  ...props
}: ComponentProps<typeof Item>) => {
  return (
    <Item variant={'default'} className={cn(className)} {...props}>
      <ItemMedia>
        <Skeleton className="size-6" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </ItemContent>
      <ItemContent className="flex-row items-center gap-4">
        <Skeleton className="h-6 w-16" />
      </ItemContent>
    </Item>
  );
};

// ======================================
// Row menu actions
// --------------------------------------
export const SessionItemActionMenu = ({
  session,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  session: Pick<Session, 'id' | 'isActive'>;
  trigger?: ReactNode;
}) => {
  const remove = useRemoveSession(),
    revoke = useRevokeSession();

  const onRemove = () => {
    toast.promise(remove.mutateAsync(session.id), {
      loading: 'Deleting...',
      success: 'Deleted',
    });
  };

  const onRevoke = () => {
    toast.promise(revoke.mutateAsync({ id: session.id }), {
      loading: 'Terminating...',
      success: 'Terminated',
    });
  };

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
          <DropdownMenuItem
            variant="destructive"
            disabled={revoke.isPending}
            onClick={onRevoke}
          >
            Terminate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            disabled={remove.isPending}
            onClick={onRemove}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
