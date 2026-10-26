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
  RoleMenu,
  useRoleMutations,
} from '@/features/access-control';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { RiAddLine, RiArrowRightLine } from '@remixicon/react';
import { Link } from 'react-router-dom';

const RolesPage = () => {
  const createDialog = useDialogState();

  const query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useRoleMutations();

  return (
    <Page className="min-h-svh">
      <RoleCreateDialog {...createDialog} />

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
                <RoleListSearchFilter />
              </div>
              <RoleListTable
                columns={{
                  action: ({ row }) => (
                    <>
                      <Button size={'icon'} variant={'ghost'} asChild>
                        <Link to={`/admin/access/roles/${row.original.id}`}>
                          <RiArrowRightLine />
                        </Link>
                      </Button>
                      <RoleMenu
                        role={row.original}
                        actions={{
                          onArchive: (r) => mutations.archive(r),
                        }}
                      />
                    </>
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
