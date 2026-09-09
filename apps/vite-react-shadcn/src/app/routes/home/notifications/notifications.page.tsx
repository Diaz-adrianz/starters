import { Container } from '@/components/layout/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageItem,
  MessageItemCreatedDate,
  MessageItemSkeleton,
  MessageItemUnreadIndicator,
  MessageList,
  MessageListItemGroup,
  MessageListPagination,
  useMessageList,
} from '@/features/notification';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResourceQuery } from '@/hooks/use-resource-query';
import authStore from '@/stores/auth.store';
import { getOption, type Option } from '@/utils/option';
import { RiInbox2Line } from '@remixicon/react';
import { useEffect, useState } from 'react';

type MenuValue = 'unread' | 'all';

const Menu: Option<MenuValue>[] = [
  {
    value: 'unread',
    label: 'Unread',
  },
  {
    value: 'all',
    label: 'All',
  },
];

const MessageListHeader = ({ menu }: { menu: MenuValue }) => {
  const { data } = useMessageList();
  return (
    <CardHeader>
      <CardTitle>
        {getOption(Menu, menu)?.label ?? ''} ({data?.totalItems ?? 0})
      </CardTitle>
    </CardHeader>
  );
};

const NotificationsPage = () => {
  const isMobile = useIsMobile();

  const authUser = authStore((s) => s.user);

  const [menu, setMenu] = useState<MenuValue>('unread');

  const query = useResourceQuery({
    page: 1,
    limit: 10,
    where: { userId: authUser?.id ?? '' },
    isnull: ['readAt'],
    order: { createdAt: 'desc' },
  });

  useEffect(() => {
    if (menu == 'unread') query.addListItem('isnull', 'readAt');
    else query.remListItem('isnull', 'readAt');
  }, [menu]);

  return (
    <div className="min-h-svh bg-muted">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full pt-4 md:w-1/4">
            <Tabs
              value={menu}
              onValueChange={(v) => setMenu(v as MenuValue)}
              orientation={isMobile ? 'horizontal' : 'vertical'}
            >
              <TabsList variant={'line'} className="w-full">
                {Menu.map((menu) => (
                  <TabsTrigger key={menu.value} value={menu.value}>
                    {menu.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full md:w-3/4">
            <PageHeading title="Notifications" />

            <Container>
              <MessageList query={query}>
                <Card>
                  <MessageListHeader menu={menu} />
                  <CardContent>
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
                          slotMedia={
                            <MessageItemUnreadIndicator readAt={m.readAt} />
                          }
                          slotRight={
                            <MessageItemCreatedDate createdAt={m.createdAt} />
                          }
                        />
                      )}
                    </MessageListItemGroup>
                    <MessageListPagination />
                  </CardContent>
                </Card>
              </MessageList>
            </Container>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotificationsPage;
