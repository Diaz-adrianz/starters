import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserList,
  RoleUserListSearchFilter,
  RoleUserListTable,
  RoleUserMenu,
} from '@/features/access-control';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { useParams } from 'react-router-dom';

const RoleAccountsPage = () => {
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
            <RoleUserList roleId={roleId} query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <RoleUserListSearchFilter />
              </div>
              <RoleUserListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    accessorKey: 'username',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="User" />
                    ),
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
                      <RoleUserMenu
                        roleUser={row.original}
                        actions={{
                          unAssign: () => {},
                        }}
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </RoleUserList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RoleAccountsPage;
