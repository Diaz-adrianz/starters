import { NumberingCell, SortableHeader } from '@/components/shared/data-table';
import { InlineLink } from '@/components/shared/inline-link';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  ActivityList,
  ActivityListStatusFilter,
  ActivityListTable,
  ActivityStatusMap,
  ActivityMenu,
  ActivityActorTypeMap,
  ActivityListSearchFilter,
} from '@/features/audit';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import { formatDate } from '@/utils/date';
import { cn } from 'cn';

export const ActivitiesPage = () => {
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
          { label: 'Audit' },
          { label: 'Activities' },
        ]}
      />
      <PageHeader title="Activities" />
      <PageSection>
        <Card>
          <CardContent>
            <ActivityList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <ActivityListStatusFilter />
                <div className="grow">
                  <ActivityListSearchFilter />
                </div>
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
                    id: 'actor',
                    header: () => 'Actor',
                    cell: ({ row }) => (
                      <div className="grid gap-1">
                        {row.original.actorType === 'user' ? (
                          <InlineLink
                            to={`/admin/identity/accounts/${row.original.actorId}`}
                          >
                            {row.original.actorName}
                          </InlineLink>
                        ) : (
                          <p className="text-muted-foreground">N/A</p>
                        )}
                        <span className="typo-caption text-muted-foreground">
                          {ActivityActorTypeMap[row.original.actorType].label}
                        </span>
                      </div>
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
                          read: () => {},
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
