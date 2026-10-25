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
  RoleList,
  RoleListSearchFilter,
  RoleListTable,
} from '@/features/access-control';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';

const RolesPage = () => {
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
          { label: 'Access' },
          { label: 'Roles' },
        ]}
      />
      <PageHeader
        title="Roles"
        action={
          <Can I={'create'} a={'identity:role'}>
            <Button>
              <RiAddLine /> Create role
            </Button>
          </Can>
        }
      />
      <PageSection>
        <Card>
          <CardContent>
            <RoleList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <RoleListSearchFilter />
              </div>
              <RoleListTable />
            </RoleList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolesPage;
