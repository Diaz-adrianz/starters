import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageList,
  MessageListContent,
  MessageListReadFilter,
} from '@/features/notification';
import { useResourceQuery } from '@/hooks/use-resource-query';
import authStore from '@/stores/auth.store';
import { ItemGroup } from '@/components/ui/item';

const NotificationsPage = () => {
  const authUser = authStore((s) => s.user);

  const query = useResourceQuery({
    page: 1,
    limit: 10,
    eq: { userId: authUser?.id ?? '', readAt: null },
    order: { createdAt: 'desc' },
  });

  return (
    <Page className="min-h-svh">
      <PageHeader title="Notifications" />

      <PageSection>
        <Card>
          <CardContent>
            <MessageList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <MessageListReadFilter />
              </div>
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
