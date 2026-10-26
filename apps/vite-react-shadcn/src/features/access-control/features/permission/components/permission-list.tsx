import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Permission } from '../types/permission.type';
import { usePermissions } from '../api/permission.query';
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { DataTable } from '@/components/shared/data-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { SearchInput } from '@/components/shared/search-input';

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type PermissionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Permission>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const PermissionListContext = createContext<PermissionListContextProps | null>(
  null
);

function usePermissionList() {
  const context = useContext(PermissionListContext);
  if (!context)
    throw new Error('usePermissionList must be used within a PermissionList.');

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function PermissionList({
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

  const { data, isLoading } = usePermissions(query.params);

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
    <PermissionListContext.Provider
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
    </PermissionListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
function PermissionListSearchFilter({
  ...props
}: ComponentProps<typeof SearchInput>) {
  const { isLoading, data, query } = usePermissionList();

  return (
    <SearchInput
      {...props}
      placeholder="Search name..."
      isLoading={isLoading}
      resultsCount={data?.totalItems}
      onChange={(value) =>
        query.batch([
          {
            type: 'set',
            key: 'search',
            value: value ? { description: value } : undefined,
          },
          { type: 'set', key: 'page', value: 1 },
        ])
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Contents
/* -------------------------------------------------------------------------- */
function PermissionListTable({
  columnDef,
}: {
  columnDef: ColumnDef<
    NonNullable<PermissionListContextProps['data']>['items'][number]
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
  } = usePermissionList();

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

export { PermissionList, PermissionListSearchFilter, PermissionListTable };
