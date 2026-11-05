import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserActions,
  RoleUserList,
  RoleUserListTable,
} from '@/features/access-control';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { useParams } from 'react-router-dom';

const AccountRolesPage = () => {
  const params = useParams(),
    id = params.id!;

  const query = useResourceQuery({
    eq: { userId: id },
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <Page className="pt-4">
      <PageSection>
        <Card>
          <CardContent>
            <RoleUserList query={query}>
              <RoleUserListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    id: 'role.name',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Role" />
                    ),
                    cell: ({ row }) => row.original.role.name,
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
                    cell: () => (
                      <RoleUserActions
                        handlers={{
                          delete: () => {},
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

export default AccountRolesPage;
