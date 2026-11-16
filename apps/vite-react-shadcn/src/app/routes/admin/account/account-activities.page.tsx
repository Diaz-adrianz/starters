import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  ActivityDialog,
  ActivityList,
  ActivityListTable,
  ActivityActions,
  type ActivityDialogPayload,
  ActivityListOccuredAtFilter,
  ActivityListOutcomeFilter,
  ActivityOutcomeMap,
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
    eq: { actorId: id },
    page: 1,
    limit: 10,
    order: { occuredAt: 'desc' },
  });

  return (
    <Page className="pt-4">
      <ActivityDialog {...detailDialog} />

      <PageSection>
        <Card>
          <CardContent>
            <ActivityList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <ActivityListOccuredAtFilter />
                <ActivityListOutcomeFilter />
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
                    id: 'occuredAt',
                    header: ({ column }) => (
                      <SortableHeader column={column} title="Occured date" />
                    ),
                    cell: ({ row }) => (
                      <p className="text-muted-foreground">
                        {formatDate(row.original.occuredAt, 'PPp')}
                      </p>
                    ),
                  },
                  {
                    id: 'outcome',
                    header: () => 'Outcome',
                    cell: ({ row }) => (
                      <p
                        className={cn(
                          'font-bold uppercase',
                          ActivityOutcomeMap[row.original.outcome].meta
                            ?.className
                        )}
                      >
                        {ActivityOutcomeMap[row.original.outcome].label}
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
                    id: 'resourceType',
                    header: () => 'Resource',
                    cell: ({ row }) => row.original.resourceType,
                    enableSorting: false,
                  },
                  {
                    id: 'menu',
                    header: '',
                    cell: ({ row }) => (
                      <ActivityActions
                        handlers={{
                          view: () =>
                            detailDialog.show({ id: row.original.id }),
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
