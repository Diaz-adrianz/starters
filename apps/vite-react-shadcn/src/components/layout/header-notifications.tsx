import { RiNotification3Line } from '@remixicon/react';
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
  MessageItemSkeleton,
  MessageItemUnreadIndicator,
  MessageList,
  MessageListItemGroup,
} from '@/features/notification';
import { Link } from 'react-router-dom';

export const HeaderNotifications = () => {
  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  if (authStatus === 'unauthenticated' || !authUser) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <RiNotification3Line />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full max-w-sm min-w-72">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>10 unread messages</PopoverDescription>
        </PopoverHeader>

        <MessageList
          initQuery={{
            page: 1,
            limit: 10,
            isnull: ['readAt'],
            order: { createdAt: 'desc' },
          }}
        >
          <MessageListItemGroup
            skeleton={<MessageItemSkeleton />}
            className="gap-0"
          >
            {(m) => (
              <MessageItem
                message={m}
                slotLeft={<MessageItemUnreadIndicator readAt={m.readAt} />}
              />
            )}
          </MessageListItemGroup>
        </MessageList>

        <Button variant={'ghost'}>
          <Link to={'/notifications'}>View all</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
