import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleCreateDialog,
  RoleList,
  RoleListSearchFilter,
  RoleListTable,
  RoleListTrashFilter,
  RoleMenu,
  RoleUpdateDialog,
  useRoleMutations,
  type RoleUpdateDialogPayload,
} from '@/features/access-control';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { Can } from '@casl/react';
import { RiAddLine, RiCheckLine, RiCloseLine } from '@remixicon/react';

const RolesPage = () => {
  const createDialog = useDialogState(),
    updateDialog = useDialogState<RoleUpdateDialogPayload>();

  const query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useRoleMutations();

  return (
    <Page className="min-h-svh">
      <RoleCreateDialog {...createDialog} />
      <RoleUpdateDialog {...updateDialog} />

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
          <Can I={'create'} a={'access-control:role'}>
            <Button onClick={() => createDialog.show()}>
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
                <div className="grow">
                  <RoleListSearchFilter />
                </div>
                <RoleListTrashFilter />
              </div>
              <RoleListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    accessorKey: 'name',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Description" />
                    ),
                  },
                  {
                    accessorKey: 'enabled',
                    header: () => 'Enabled',
                    cell: ({ row }) =>
                      row.original.enabled ? (
                        <Badge size={'icon'}>
                          <RiCheckLine />
                        </Badge>
                      ) : (
                        <Badge size={'icon'} variant={'destructive'}>
                          <RiCloseLine />
                        </Badge>
                      ),
                    enableSorting: false,
                  },
                  {
                    accessorKey: 'default',
                    header: () => 'Default',
                    cell: ({ row }) =>
                      row.original.default ? (
                        <Badge size={'icon'}>
                          <RiCheckLine />
                        </Badge>
                      ) : (
                        <Badge size={'icon'} variant={'destructive'}>
                          <RiCloseLine />
                        </Badge>
                      ),
                    enableSorting: false,
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row }) => (
                      <RoleMenu
                        role={row.original}
                        actions={
                          query.state.trash
                            ? {
                                restore: (r) => mutations.restore(r),
                                delete: (r) => mutations.del(r),
                              }
                            : {
                                read: `/admin/access/roles/${row.original.id}`,
                                update: (r) => updateDialog.show({ id: r.id }),
                                archive: (r) => mutations.archive(r),
                              }
                        }
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </RoleList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolesPage;
