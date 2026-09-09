import {
  RiArrowRightLine,
  RiInbox2Line,
  RiNotification3Line,
} from '@remixicon/react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../ui/popover';
import authStore from '@/stores/auth.store';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageItemSkeleton,
  MessageItemUnreadIndicator,
  MessageList,
  MessageListItemGroup,
  useMessagesCount,
} from '@/features/notification';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { Empty, EmptyHeader, EmptyMedia } from '../ui/empty';

const MAX_MESSAGES = 10;

export const HeaderNotifications = () => {
  const [open, setOpen] = useState(false);

  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  const query = useResourceQuery({
    page: 1,
    limit: MAX_MESSAGES,
    where: { userId: authUser?.id ?? '' },
    isnull: ['readAt'],
    order: { createdAt: 'desc' },
  });

  const unreadCount = useMessagesCount(query.params),
    unreadCountText = unreadCount.data
      ? unreadCount.data > 99
        ? '99+'
        : String(unreadCount.data)
      : '';

  if (authStatus === 'unauthenticated' || !authUser) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'} className="relative">
          <RiNotification3Line />
          {unreadCountText && (
            <Badge
              variant={'destructive'}
              className="absolute -top-1.5 -right-2"
            >
              {unreadCountText}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full max-w-sm min-w-72">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>
            {unreadCountText || 'No'} unread messages
          </PopoverDescription>
        </PopoverHeader>
        <MessageList query={query}>
          <MessageListItemGroup
            skeleton={<MessageItemSkeleton />}
            empty={
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={'icon'}>
                    <RiInbox2Line />
                  </EmptyMedia>
                </EmptyHeader>
              </Empty>
            }
            className="gap-0"
          >
            {(m) => (
              <MessageItem
                key={m.id}
                message={m}
                slotMedia={<MessageItemUnreadIndicator readAt={m.readAt} />}
                slotBottom={<MessageItemCreatedDate createdAt={m.createdAt} />}
              />
            )}
          </MessageListItemGroup>
        </MessageList>

        <Button
          variant={(unreadCount.data ?? 0) > MAX_MESSAGES ? 'default' : 'ghost'}
          asChild
        >
          <Link to={'/notifications'} onClick={() => setOpen(false)}>
            {(unreadCount.data ?? 0) > MAX_MESSAGES
              ? 'View all'
              : 'Go to notifications'}
            <RiArrowRightLine />
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
