import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  ActivityActorTypeMap,
  ActivityDialog,
  ActivityList,
  ActivityListStatusFilter,
  ActivityListTable,
  ActivityMenu,
  ActivityStatusMap,
  type ActivityDialogPayload,
} from '@/features/audit';
import { useDialogState } from '@/hooks/use-dialog';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { cn } from 'cn';
import { useParams } from 'react-router-dom';

const AccountActivitiesPage = () => {
  const detailDialog = useDialogState<ActivityDialogPayload>();

  const params = useParams(),
    id = params.id!;

  const query = useResourceQuery({
    eq: { actorId: id, actorType: ActivityActorTypeMap.user.value },
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <Page className="pt-4">
      <ActivityDialog {...detailDialog} />

      <PageSection>
        <Card>
          <CardContent>
            <ActivityList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <ActivityListStatusFilter />
              </div>

              <ActivityListTable
                columnDef={[
                  {
                    id: 'no',
                    header: '#',
                    cell: NumberingCell,
                    enableSorting: false,
                  },
                  {
                    id: 'createdAt',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Timestamp" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {formatDate(
                          row.original.createdAt,
                          'dd MMM yyyy, HH:mm'
                        )}
                      </p>
                    ),
                  },
                  {
                    id: 'status',
                    header: () => 'Status',
                    cell: ({ row }) => (
                      <p
                        className={cn(
                          'font-bold uppercase',
                          ActivityStatusMap[row.original.status].meta?.className
                        )}
                      >
                        {ActivityStatusMap[row.original.status].label}
                      </p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'module',
                    header: () => 'Module',
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {row.original.module}
                      </p>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'action',
                    header: () => 'Action',
                    cell: ({ row }) => <p>{row.original.action}</p>,
                    enableSorting: false,
                  },
                  {
                    id: 'target',
                    header: () => 'Target',
                    cell: ({ row }) => (
                      <div className="grid">
                        <p>{row.original.targetType}</p>
                        <span className="typo-caption text-muted-foreground">
                          {row.original.targetName}
                        </span>
                      </div>
                    ),
                    enableSorting: false,
                  },
                  {
                    id: 'menu',
                    header: '',
                    cell: ({ row }) => (
                      <ActivityMenu
                        activity={row.original}
                        actions={{
                          read: (a) => detailDialog.show({ id: a.id }),
                        }}
                      />
                    ),
                    enableSorting: false,
                  },
                ]}
              />
            </ActivityList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default AccountActivitiesPage;
