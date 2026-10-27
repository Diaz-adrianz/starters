import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  UserList,
  UserListSearchFilter,
  UserListTrashFilter,
  UserListTable,
  UserMenu,
} from '@/features/identity';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { getInitials } from '@/utils/string';
import { Can } from '@casl/react';
import { RiAddLine, RiCheckLine, RiCloseLine } from '@remixicon/react';

const AccountsPage = () => {
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
          { label: 'Accounts' },
        ]}
      />
      <PageHeader
        title="Accounts"
        action={
          <Can I={'create'} a={'identity:user'}>
            <Button>
              <RiAddLine /> Create account
            </Button>
          </Can>
        }
      />
      <PageSection>
        <Card>
          <CardContent>
            <UserList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <div className="grow">
                  <UserListSearchFilter />
                </div>
                <UserListTrashFilter />
              </div>
              <UserListTable
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
                    cell: ({ row }) => (
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarImage src={row.original.avatar ?? ''} alt="" />
                          <AvatarFallback>
                            {getInitials(row.original.username)}
                          </AvatarFallback>
                        </Avatar>
                        <p>{row.original.username}</p>
                      </div>
                    ),
                  },
                  {
                    id: 'profile.firstName',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Name" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.profile?.firstName}{' '}
                        {row.original.profile?.lastName}
                      </p>
                    ),
                  },
                  {
                    id: 'email',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Email" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.email}
                      </p>
                    ),
                  },
                  {
                    id: 'profile.phoneNumber',
                    header: () => 'Phone number',
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.profile?.phoneNumber}
                      </p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'profile.gender',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Gender" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.profile?.gender}
                      </p>
                    ),
                  },
                  {
                    id: 'enabled',
                    header: () => 'Status',
                    cell: ({ row }) =>
                      row.original.enabled ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant={'secondary'}>Inactive</Badge>
                      ),
                    enableSorting: false,
                  },
                  {
                    id: 'verifiedAt',
                    header: () => 'Verified',
                    cell: ({ row }) =>
                      row.original.verifiedAt ? (
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
                      <UserMenu
                        user={row.original}
                        actions={
                          query.state.trash
                            ? {
                                restore: () => {},
                                delete: () => {},
                              }
                            : {
                                read: `/admin/identity/accounts/${row.original.id}`,
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
            </UserList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default AccountsPage;
