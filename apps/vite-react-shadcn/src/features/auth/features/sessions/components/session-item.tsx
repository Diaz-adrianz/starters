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
import { formatDateToNow } from '@/utils/date';
import { cn } from 'cn';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionClientDeviceMap } from '../constants/session.constant';

function SessionItem({
  session,
  slotRight,
  className,
  ...props
}: ComponentProps<typeof Item> & {
  session: Session;
  slotRight?: ReactNode;
}) {
  const clientDevice = session.clientDevice
    ? SessionClientDeviceMap[session.clientDevice]
    : null;

  return (
    <Item size={'xs'} className={cn(className)} {...props}>
      <ItemMedia variant={'icon'}>
        {clientDevice?.meta?.Icon && (
          <clientDevice.meta.Icon className="size-6" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{session.clientLabel || 'Unknown'}</ItemTitle>
        <ItemDescription>
          {session.os} · {session.browser}
        </ItemDescription>
        <ItemDescription>
          Last used {formatDateToNow(session.lastUsedAt)}
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
}

function SessionItemSkeleton({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item size={'xs'} className={cn(className)} {...props}>
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
}

export { SessionItem, SessionItemSkeleton };
