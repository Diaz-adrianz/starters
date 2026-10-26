import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  ProfileList,
  ProfileListSearchFilter,
  ProfileListTable,
  ProfileMenu,
} from '@/features/identity';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';

const ProfilesPage = () => {
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
          { label: 'Identity' },
          { label: 'Profiles' },
        ]}
      />
      <PageHeader title="Profiles" />
      <PageSection>
        <Card>
          <CardContent>
            <ProfileList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <ProfileListSearchFilter />
              </div>
              <ProfileListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    accessorKey: 'firstName',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="First name" />
                    ),
                  },
                  {
                    accessorKey: 'lastName',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Last name" />
                    ),
                  },
                  {
                    accessorKey: 'gender',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Gender" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.gender}
                      </p>
                    ),
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row }) => (
                      <ProfileMenu
                        profile={row.original}
                        actions={
                          query.state.trash
                            ? {
                                restore: () => {},
                                delete: () => {},
                              }
                            : {
                                read: `/admin/identity/profiles/${row.original.id}`,
                                update: () => {},
                                archive: () => {},
                              }
                        }
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </ProfileList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default ProfilesPage;
