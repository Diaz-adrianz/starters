import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  PermissionList,
  PermissionListSearchFilter,
  PermissionListTable,
  PermissionMenuActions,
} from '@/features/access-control';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';

const PermissionsPage = () => {
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
          { label: 'Permissions' },
        ]}
      />
      <PageHeader title="Permissions" />
      <PageSection>
        <Card>
          <CardContent>
            <PermissionList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <PermissionListSearchFilter />
              </div>
              <PermissionListTable
                columns={{
                  action: ({ row }) => (
                    <PermissionMenuActions
                      permission={row.original}
                      actions={{
                        update: () => {},
                      }}
                    />
                  ),
                }}
              />
            </PermissionList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default PermissionsPage;
