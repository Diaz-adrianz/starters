import {
  RiArrowRightLine,
  RiInbox2Line,
  RiNotification3Fill,
  RiNotification3Line,
} from '@remixicon/react';
import { Button } from '../../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../../ui/popover';
import authStore from '@/stores/auth.store';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageItemSkeleton,
  MessageItemUnreadIndicator,
  MessageList,
  MessageListItemGroup,
  messageQueryKeys,
  useMessagesCount,
  useNotificationSocket,
} from '@/features/notification';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '../../ui/badge';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { Empty, EmptyHeader, EmptyMedia } from '../../ui/empty';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';

const MAX_MESSAGES = 10;

export const HeaderNotifications = () => {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);

  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  const query = useResourceQuery({
    page: 1,
    limit: MAX_MESSAGES,
    eq: { userId: authUser?.id ?? '', readAt: null },
    order: { createdAt: 'desc' },
  });

  const unreadCount = useMessagesCount(query.params),
    unreadCountText = unreadCount.data
      ? unreadCount.data > 99
        ? '99+'
        : String(unreadCount.data)
      : '';

  useNotificationSocket({
    onMessageCreated: (data) => {
      qc.invalidateQueries({ queryKey: messageQueryKeys.all });
      toast(data.title, {
        description: data.body,
        id: data.id,
        duration: 5000,
      });
    },
  });

  if (authStatus === 'unauthenticated' || !authUser) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'} className="relative">
          {open ? <RiNotification3Fill /> : <RiNotification3Line />}
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
      <PopoverContent align="end" className="w-full max-w-sm min-w-72 pb-0">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>
            {unreadCountText || 'No'} unread messages
          </PopoverDescription>
        </PopoverHeader>
        <ScrollArea className="max-h-96 overflow-auto pb-16">
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
                  slotBottom={
                    <MessageItemCreatedDate createdAt={m.createdAt} />
                  }
                />
              )}
            </MessageListItemGroup>
          </MessageList>
        </ScrollArea>

        <Button
          className="absolute right-4 bottom-4 left-4"
          variant={
            (unreadCount.data ?? 0) > MAX_MESSAGES ? 'default' : 'secondary'
          }
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
