import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Activity } from '../types/activity.type';
import { useActivities } from '../api/activity.query';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { DataTable } from '@/components/shared/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/shared/search-input';
import { DatePickerRange } from '@/components/shared/date-picker';
import { ActivityOutcomeOptions } from '../constants/activity.constant';

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type ActivityListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Activity>['data'] | undefined;
  isLoading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const ActivityListContext = createContext<ActivityListContextProps | null>(
  null
);

function useActivityList() {
  const context = useContext(ActivityListContext);
  if (!context)
    throw new Error('useActivityList must be used within a ActivityList.');

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function ActivityList({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useActivities(query.params);

  return (
    <ActivityListContext.Provider
      value={{
        query,
        data,
        isLoading,
        rowSelection,
        setRowSelection,
      }}
    >
      {children}
    </ActivityListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
function ActivityListSearchFilter() {
  const { isLoading, data, query } = useActivityList();

  return (
    <SearchInput
      isLoading={isLoading}
      resultsCount={data?.totalItems}
      onChange={(value) =>
        query.set(
          'search',
          value
            ? {
                requestId: value,
                module: value,
                actorName: value,
                action: value,
                resourceType: value,
              }
            : undefined
        )
      }
    />
  );
}

function ActivityListOutcomeFilter() {
  const { query } = useActivityList();

  return (
    <Select
      onValueChange={(v) =>
        v ? query.add('eq', 'outcome', v) : query.del('eq', 'outcome')
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Outcome" />
      </SelectTrigger>
      <SelectContent>
        {ActivityOutcomeOptions.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ActivityListOccuredAtFilter() {
  const { query } = useActivityList();

  return (
    <DatePickerRange
      placeholder="Timestamp"
      min={1}
      onValueChange={({ from, to }) =>
        query.batch([
          from
            ? { type: 'add', key: 'gte', field: 'occuredAt', value: from }
            : { type: 'del', key: 'gte', field: 'occuredAt' },
          to
            ? { type: 'add', key: 'lte', field: 'occuredAt', value: to }
            : { type: 'del', key: 'lte', field: 'occuredAt' },
        ])
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Contents
/* -------------------------------------------------------------------------- */
function ActivityListTable({
  columnDef,
}: {
  columnDef: ColumnDef<
    NonNullable<ActivityListContextProps['data']>['items'][number]
  >[];
}) {
  const { data, isLoading, query, rowSelection, setRowSelection } =
    useActivityList();

  const pagination = {
    pageIndex: query.state.page - 1,
    pageSize: query.state.limit,
  };

  const sorting = Object.entries(query.state.order ?? {}).map(([k, v]) => ({
    id: k,
    desc: v === 'desc',
  }));

  return (
    <DataTable
      columns={columnDef}
      data={data?.items ?? []}
      pageCount={data?.totalPages ?? 0}
      totalItems={data?.totalItems ?? 0}
      getRowId={(row) => row.id}
      pagination={pagination}
      onPaginationChange={(up) => {
        const p = typeof up === 'function' ? up(pagination) : up;
        query.batch([
          { type: 'set', key: 'page', value: p.pageIndex + 1 },
          { type: 'set', key: 'limit', value: p.pageSize },
        ]);
      }}
      sorting={sorting}
      onSortingChange={(up) => {
        const s = typeof up === 'function' ? up(sorting) : up;
        query.set(
          'order',
          s.reduce<ConditionMap>((acc, { id, desc }) => {
            acc[id] = desc ? 'desc' : 'asc';
            return acc;
          }, {})
        );
      }}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      isLoading={isLoading}
    />
  );
}

export {
  ActivityList,
  ActivityListSearchFilter,
  ActivityListOutcomeFilter,
  ActivityListOccuredAtFilter,
  ActivityListTable,
};
