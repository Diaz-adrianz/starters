import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Activity } from '../types/activity.type';
import { useActivities } from '../api/activity.query';
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
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

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type ActivityListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Activity>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
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

  const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: (query.state.page ?? DEFAULT_PAGE) - 1,
      pageSize: query.state.limit ?? DEFAULT_LIMIT,
    }),
    [sorting, setSorting] = useState<SortingState>(
      Object.entries(query.state.order ?? {}).map(([k, v]) => ({
        id: k,
        desc: v === 'desc',
      }))
    ),
    [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useActivities(query.params);

  useEffect(() => {
    query.batch([
      {
        type: 'set',
        key: 'order',
        value: sorting.reduce<ConditionMap>((acc, { id, desc }) => {
          acc[id] = desc ? 'desc' : 'asc';
          return acc;
        }, {}),
      },
      { type: 'set', key: 'page', value: 1 },
    ]);
  }, [sorting]);

  useEffect(() => {
    query.batch([
      { type: 'set', key: 'page', value: pagination.pageIndex + 1 },
      { type: 'set', key: 'limit', value: pagination.pageSize },
    ]);
  }, [pagination]);

  return (
    <ActivityListContext.Provider
      value={{
        query,
        data,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
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
        query.batch([
          {
            type: 'set',
            key: 'search',
            value: value
              ? {
                  requestId: value,
                  module: value,
                  actorName: value,
                  action: value,
                  resourceType: value,
                }
              : undefined,
          },
          { type: 'set', key: 'page', value: 1 },
        ])
      }
    />
  );
}

function ActivityListOutcomeFilter() {
  const { query } = useActivityList();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value) query.add('eq', 'outcome', value);
    else query.del('eq', 'outcome');
  }, [value]);

  return (
    <Select value={value} onValueChange={setValue}>
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
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
  } = useActivityList();

  return (
    <DataTable
      columns={columnDef}
      data={data?.items ?? []}
      pageCount={data?.totalPages ?? 0}
      totalItems={data?.totalItems ?? 0}
      getRowId={(row) => row.id}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
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
