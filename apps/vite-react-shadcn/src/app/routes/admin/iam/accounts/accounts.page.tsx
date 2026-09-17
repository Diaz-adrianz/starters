import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
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
    <>
      <PageHeading title="Accounts" />

      <UserList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <UserListSearchBox />
          <Button>
            <RiAddLine /> Create account
          </Button>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <UserListItemGroup
                separator
                skeleton={<UserItemSkeleton className="p-0" />}
                className="mb-8"
              >
                {(user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    className="p-0"
                    slotBottom={<UserItemEmail email={user.email} />}
                    slotRight={
                      <UserItemVerifiedBadge verifiedAt={user.verifiedAt} />
                    }
                    slotActions={<UserItemActionMenu user={user} />}
                  />
                )}
              </UserListItemGroup>
              <UserListPagination />
            </CardContent>
          </Card>
        </Container>
      </UserList>
    </>
  );
};

export default AccountsPage;
