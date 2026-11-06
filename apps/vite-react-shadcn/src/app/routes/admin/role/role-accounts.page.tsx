import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserList,
  RoleUserListSearchFilter,
  RoleUserListTable,
  RoleUserActions,
  type RoleUserCreateDialogPayload,
  RoleUserCreateDialog,
  useRole,
  useRoleUserMutations,
} from '@/features/access-control';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { Can } from '@casl/react';
import { useParams } from 'react-router-dom';

const RoleAccountsPage = () => {
  const createDialog = useDialogState<RoleUserCreateDialogPayload>();

  const params = useParams();

  const roleId = params.id!,
    role = useRole(roleId);

  const query = useResourceQuery({
      eq: { roleId },
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useRoleUserMutations();

  return (
    <Page className="pt-4">
      <RoleUserCreateDialog {...createDialog} />

      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <RoleUserList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <div className="grow">
                  <RoleUserListSearchFilter />
                </div>
                {role.data && (
                  <Can I={'create'} a={'access-control:role-user'}>
                    <Button
                      onClick={() =>
                        createDialog.show({
                          role: { id: role.data.id, name: role.data.name },
                        })
                      }
                    >
                      Assign user
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
                    accessorKey: 'username',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Account" />
                    ),
                  },
                  {
                    accessorKey: 'createdAt',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Added date" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {formatDate(row.original.createdAt, 'PPp')}
                      </p>
                    ),
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row: { original: roleUser } }) => (
                      <RoleUserActions
                        handlers={{
                          viewUser: `/admin/iam/accounts/${roleUser.userId}`,
                          delete: () =>
                            mutations.del({
                              ...roleUser,
                              roleName: roleUser.role?.name,
                            }),
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
