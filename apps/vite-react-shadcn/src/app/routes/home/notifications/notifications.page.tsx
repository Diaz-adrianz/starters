import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageList,
  MessageListContent,
} from '@/features/notification';
import { useResourceQuery } from '@/hooks/use-resource-query';
import authStore from '@/stores/auth.store';
import { useEffect, useState } from 'react';
import { Chip, ChipGroup } from '@/components/shared/chip';
import { ItemGroup } from '@/components/ui/item';

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
              <MessageListContent>
                {({ items }) => (
                  <ItemGroup>
                    {items.map((m) => (
                      <MessageItem
                        key={m.id}
                        message={m}
                        slotRight={
                          <MessageItemCreatedDate createdAt={m.createdAt} />
                        }
                      />
                    ))}
                  </ItemGroup>
                )}
              </MessageListContent>
            </MessageList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default NotificationsPage;
