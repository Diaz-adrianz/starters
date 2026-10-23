import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageItemSkeleton,
  MessageItemUnreadIndicator,
  MessageList,
  MessageListItemGroup,
  MessageListPagination,
} from '@/features/notification';
import { useResourceQuery } from '@/hooks/use-resource-query';
import authStore from '@/stores/auth.store';
import type { Menu } from '@/types/menu.type';
import { RiInbox2Line } from '@remixicon/react';
import { useEffect, useState } from 'react';

const Menus: Menu[] = [
  {
    path: 'unread',
    label: 'Unread',
  },
  {
    path: 'all',
    label: 'All',
  },
];

const NotificationsPage = () => {
  const authUser = authStore((s) => s.user);

  const [path, setPath] = useState<string>('unread');

  const query = useResourceQuery({
    page: 1,
    limit: 10,
    eq: { userId: authUser?.id ?? '', readAt: null },
    order: { createdAt: 'desc' },
  });

  useEffect(() => {
    if (path == 'unread') query.add('eq', 'readAt', null);
    else query.del('eq', 'readAt');
  }, [path]);

  return (
    <Page className="min-h-svh">
      <PageHeader title="Notifications" />

      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <MessageList query={query}>
              <MessageListItemGroup
                skeleton={<MessageItemSkeleton />}
                empty={
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={'icon'}>
                        <RiInbox2Line />
                      </EmptyMedia>
                      <EmptyTitle>No messages yet</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                }
                className="mb-4"
                separator
              >
                {(m) => (
                  <MessageItem
                    key={m.id}
                    message={m}
                    slotMedia={<MessageItemUnreadIndicator readAt={m.readAt} />}
                    slotRight={
                      <MessageItemCreatedDate createdAt={m.createdAt} />
                    }
                  />
                )}
              </MessageListItemGroup>
              <MessageListPagination />
            </MessageList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default NotificationsPage;
