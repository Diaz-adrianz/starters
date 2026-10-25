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
  UserList,
  UserListSearchFilter,
  UserListTable,
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
                <UserListSearchFilter />
              </div>
              <UserListTable />
            </UserList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default AccountsPage;
