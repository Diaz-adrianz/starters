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
  ProfileGenderMap,
  UserStatusMap,
  UserInviteDialog,
  UserActions,
  useUserMutations,
} from '@/features/identity';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { getOptionMap } from '@/utils/option';
import { getInitials } from '@/utils/string';
import { Can } from '@casl/react';
import { RiUserAddFill } from '@remixicon/react';

const AccountsPage = () => {
  const inviteDialog = useDialogState();

  const query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useUserMutations();

  return (
    <Page className="min-h-svh">
      <UserInviteDialog {...inviteDialog} />

      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'IAM' },
          { label: 'Accounts' },
        ]}
      />
      <PageHeader
        title="Accounts"
        action={
          <Can I={'invite'} a={'identity:user'}>
            <Button onClick={() => inviteDialog.show()}>
              <RiUserAddFill /> Invite account
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
                    header: () => 'Gender',
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {
                          getOptionMap(
                            ProfileGenderMap,
                            row.original.profile?.gender
                          )?.label
                        }
                      </p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'status',
                    header: () => 'Status',
                    cell: ({ row }) => (
                      <Badge
                        variant={
                          UserStatusMap[row.original.status].meta?.badgeVariant
                        }
                      >
                        {UserStatusMap[row.original.status].label}
                      </Badge>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'action',
                    header: '',
                    cell: ({ row: { original: user } }) => (
                      <UserActions
                        collapsed={['resendInvite']}
                        handlers={
                          query.state.trash
                            ? {
                                restore: () => mutations.restore(user),
                                delete: () => mutations.del(user),
                              }
                            : {
                                view: `/admin/iam/accounts/${user.id}`,
                                edit: () => {},
                                remove: () => mutations.archive(user),
                                resendInvite:
                                  user.status === 'invited'
                                    ? () => mutations.resendInvite(user)
                                    : undefined,
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
