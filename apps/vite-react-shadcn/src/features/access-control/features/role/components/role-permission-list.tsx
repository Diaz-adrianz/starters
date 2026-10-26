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

import type { RolePermission } from '../types/role.type';
import { useRolePermissions } from '../api/role.query';
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { DataTable } from '@/components/shared/data-table';
import { SearchInput } from '@/components/shared/search-input';

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type RolePermissionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<RolePermission>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const RolePermissionListContext =
  createContext<RolePermissionListContextProps | null>(null);

function useRolePermissionList() {
  const context = useContext(RolePermissionListContext);
  if (!context)
    throw new Error(
      'useRolePermissionList must be used within a RolePermissionList.'
    );

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function RolePermissionList({
  children,
  roleId,
  query: controlledQuery,
}: {
  children: ReactNode;
  roleId: string;
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

  const { data, isLoading } = useRolePermissions(roleId, query.params);

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
    <RolePermissionListContext.Provider
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
    </RolePermissionListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
function RolePermissionListSearchFilter() {
  const { isLoading, data, query } = useRolePermissionList();

  return (
    <SearchInput
      placeholder="Search permission..."
      isLoading={isLoading}
      resultsCount={data?.totalItems}
      onChange={(value) =>
        query.batch([
          {
            type: 'set',
            key: 'search',
            value: value ? { 'permission.description': value } : undefined,
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
function RolePermissionListTable({
  columnDef,
}: {
  columnDef: ColumnDef<
    NonNullable<RolePermissionListContextProps['data']>['items'][number]
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
  } = useRolePermissionList();

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
  RolePermissionList,
  RolePermissionListSearchFilter,
  RolePermissionListTable,
};
