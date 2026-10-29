import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  RolePermissionList,
  RolePermissionListSearchFilter,
  RolePermissionListTable,
  RolePermissionMenu,
} from '@/features/access-control';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { useParams } from 'react-router-dom';

const RolePermissionsPage = () => {
  const params = useParams();

  const roleId = params.id!,
    query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    });

  return (
    <Page className="pt-4">
      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <RolePermissionList roleId={roleId} query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <RolePermissionListSearchFilter />
              </div>
              <RolePermissionListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    id: 'permission.description',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Permission" />
                    ),
                    cell: ({ row }) => row.original.permission.description,
                  },
                  {
                    accessorKey: 'createdAt',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Added date" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {formatDate(
                          row.original.createdAt,
                          'dd MMM yyyy HH:mm'
                        )}
                      </p>
                    ),
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row }) => (
                      <RolePermissionMenu
                        rolePermission={row.original}
                        actions={{
                          revoke: () => {},
                        }}
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </RolePermissionList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolePermissionsPage;
