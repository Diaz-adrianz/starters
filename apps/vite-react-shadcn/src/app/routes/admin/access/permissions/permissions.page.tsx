import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  PermissionList,
  PermissionListSearchFilter,
  PermissionListTable,
  PermissionMenu,
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
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    accessorKey: 'description',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Description" />
                    ),
                  },
                  {
                    accessorKey: 'module',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Module" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.module}
                      </p>
                    ),
                  },
                  {
                    accessorKey: 'enabled',
                    header: () => 'Status',
                    cell: ({ row }) =>
                      row.original.enabled ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant={'secondary'}>Inactive</Badge>
                      ),
                    enableSorting: false,
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row }) => (
                      <PermissionMenu
                        permission={row.original}
                        actions={{
                          update: () => {},
                        }}
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </PermissionList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default PermissionsPage;
