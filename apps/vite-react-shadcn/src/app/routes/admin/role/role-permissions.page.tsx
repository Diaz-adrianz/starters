import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RolePermissionList,
  RolePermissionListSearchFilter,
  RolePermissionListTable,
  RolePermissionActions,
  useRole,
  useRolePermissionMutations,
  type RolePermissionCreateDialogPayload,
  RolePermissionCreateDialog,
} from '@/features/access-control';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { Can } from '@casl/react';
import { useParams } from 'react-router-dom';

const RolePermissionsPage = () => {
  const createDialog = useDialogState<RolePermissionCreateDialogPayload>();

  const params = useParams();

  const roleId = params.id!,
    role = useRole(roleId);

  const query = useResourceQuery({
      eq: { roleId },
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useRolePermissionMutations();

  return (
    <Page className="pt-4">
      <RolePermissionCreateDialog {...createDialog} />

      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <RolePermissionList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <div className="grow">
                  <RolePermissionListSearchFilter />
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
                      Grant permission
                    </Button>
                  </Can>
                )}
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
                    cell: ({ row }) => row.original.permission?.description,
                  },
                  {
                    id: 'permission.module',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Module" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.permission?.module}
                      </p>
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
                    cell: ({ row: { original: item } }) => (
                      <RolePermissionActions
                        handlers={{
                          delete: () =>
                            mutations.del({
                              id: item.id,
                              roleName: item.role?.name ?? '',
                              permissionDesc:
                                item.permission?.description ?? '',
                            }),
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
