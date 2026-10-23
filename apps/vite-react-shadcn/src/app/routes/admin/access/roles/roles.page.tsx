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
  RoleListSearchBox,
  RoleListItemGroup,
  RoleItemSkeleton,
  RoleItem,
  RoleItemActionMenu,
  RoleListPagination,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
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
                <RoleListSearchBox />
              </div>
              <RoleListItemGroup
                separator
                skeleton={<RoleItemSkeleton />}
                className="mb-8"
              >
                {(role) => (
                  <RoleItem
                    key={role.id}
                    role={role}
                    titleTo={'/admin/access/roles/' + role.id}
                    slotActions={<RoleItemActionMenu role={role} />}
                  />
                )}
              </RoleListItemGroup>
              <RoleListPagination />
            </RoleList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolesPage;
