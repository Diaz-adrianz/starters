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
import { RiInbox2Line } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { Chip, ChipGroup } from '@/components/shared/chip';

const NotificationsPage = () => {
  const authUser = authStore((s) => s.user);

  const [status, setStatus] = useState('unread');

  const query = useResourceQuery({
    page: 1,
    limit: 10,
    eq: { userId: authUser?.id ?? '', readAt: null },
    order: { createdAt: 'desc' },
  });

  useEffect(() => {
    if (status == 'unread') query.add('eq', 'readAt', null);
    else query.del('eq', 'readAt');
  }, [status]);

  return (
    <Page className="min-h-svh">
      <PageHeader title="Notifications" />

      <PageSection horizontal>
        <ChipGroup value={status} onValueChanged={setStatus}>
          <Chip value="unread">Unread</Chip>
          <Chip value="all">All</Chip>
        </ChipGroup>
      </PageSection>

      <PageSection>
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
