import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserActions,
  RoleUserCreateDialog,
  RoleUserList,
  RoleUserListTable,
  type RoleUserCreateDialogPayload,
} from '@/features/access-control';
import { useUser } from '@/features/identity';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { Can } from '@casl/react';
import { useParams } from 'react-router-dom';

const AccountRolesPage = () => {
  const createDialog = useDialogState<RoleUserCreateDialogPayload>();

  const params = useParams(),
    userId = params.id!,
    user = useUser(userId);

  const query = useResourceQuery({
    eq: { userId },
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <Page className="pt-4">
      <RoleUserCreateDialog {...createDialog} />

      <PageSection>
        <Card>
          <CardContent>
            <RoleUserList query={query}>
              <div className="mb-8 flex flex-wrap justify-end gap-2">
                {user.data && (
                  <Can I={'create'} a={'access-control:role-user'}>
                    <Button
                      onClick={() =>
                        createDialog.show({
                          user: {
                            id: user.data.id,
                            username: user.data.username,
                            avatar: user.data.avatar,
                          },
                        })
                      }
                    >
                      Assign role
                    </Button>
                  </Can>
                )}
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
