import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  SessionDialog,
  SessionList,
  SessionListTable,
  SessionMenu,
  useSessionMutations,
  type SessionDialogPayload,
} from '@/features/auth';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { useParams } from 'react-router-dom';

const AccountSessionsPage = () => {
  const params = useParams(),
    id = params.id!;

  const detailDialog = useDialogState<SessionDialogPayload>();

  const query = useResourceQuery({
      eq: { userId: id },
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    }),
    mutations = useSessionMutations();

  return (
    <Page className="pt-4">
      <SessionDialog {...detailDialog} />

      <PageSection>
        <Card>
          <CardContent>
            <SessionList query={query}>
              <SessionListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    id: 'device',
                    header: 'Device',
                    cell: ({ row }) => (
                      <div>
                        <p>{row.original.deviceLabel || 'Unknown'}</p>
                        <small className="typo-caption text-muted-foreground">
                          {row.original.deviceType}
                        </small>
                      </div>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'isActive',
                    header: 'Status',
                    cell: ({ row }) =>
                      row.original.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant={'secondary'}>Inactive</Badge>
                      ),
                    enableSorting: false,
                  },
                  {
                    id: 'os',
                    header: 'OS',
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">{row.original.os}</p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'browser',
                    header: 'Browser',
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.browser}
                      </p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'lastUsedAt',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Last used" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {formatDate(
                          row.original.lastUsedAt,
                          'dd MMM yyyy, hh:mm a'
                        )}
                      </p>
                    ),
                  },
                  {
                    id: 'menu',
                    header: '',
                    cell: ({ row }) => (
                      <SessionMenu
                        session={row.original}
                        actions={{
                          read: (s) => detailDialog.show({ id: s.id }),
                          ...(row.original.isActive
                            ? { revoke: (s) => mutations.revoke(s) }
                            : { delete: (s) => mutations.del(s) }),
                        }}
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </SessionList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default AccountSessionsPage;
