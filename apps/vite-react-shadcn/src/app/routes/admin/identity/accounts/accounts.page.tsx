import { Can } from '@/components/shared/can';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  UserItem,
  UserItemActionMenu,
  UserItemEmail,
  UserItemSkeleton,
  UserItemVerifiedBadge,
  UserList,
  UserListItemGroup,
  UserListPagination,
  UserListSearchBox,
} from '@/features/identity';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';

const AccountsPage = () => {
  const query = useResourceQuery({
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <Page className="min-h-svh">
      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Identity' },
          { label: 'Accounts' },
        ]}
      />
      <PageHeader
        title="Accounts"
        action={
          <Can I={'create'} a={'identity:user'}>
            <Button>
              <RiAddLine /> Create account
            </Button>
          </Can>
        }
      />
      <PageSection>
        <Card>
          <CardContent>
            <UserList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <UserListSearchBox />
              </div>

              <UserListItemGroup
                separator
                skeleton={<UserItemSkeleton />}
                className="mb-8"
              >
                {(user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    slotBottom={<UserItemEmail email={user.email} />}
                    slotRight={
                      <UserItemVerifiedBadge verifiedAt={user.verifiedAt} />
                    }
                    slotActions={<UserItemActionMenu user={user} />}
                  />
                )}
              </UserListItemGroup>
              <UserListPagination />
            </UserList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default AccountsPage;
