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
  RoleCreateDialog,
  RoleList,
  RoleListSearchFilter,
  RoleListTable,
  RoleListTrashFilter,
  RoleMenuActions,
  RoleUpdateDialog,
  useRoleMutations,
  type RoleUpdateDialogPayload,
} from '@/features/access-control';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';

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
                <RoleListSearchFilter className="w-auto grow" />
                <RoleListTrashFilter />
              </div>
              <RoleListTable
                columns={{
                  action: ({ row }) => (
                    <RoleMenuActions
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
                }}
              />
            </RoleList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolesPage;
