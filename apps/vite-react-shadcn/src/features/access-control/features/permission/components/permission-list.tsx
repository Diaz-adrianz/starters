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
import { useResourceQuery } from '@/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import { RiLoaderLine, RiSearchLine } from '@remixicon/react';
import type { Permission } from '../types/permission.type';
import { usePermissions } from '../api/permission.query';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { DataTable } from '@/components/shared/data-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { PermissionTableColumnDef } from './permission-table';

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
}: ComponentProps<typeof InputGroup>) {
  const { isLoading, data, query } = usePermissionList();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    query.batch([
      {
        type: 'set',
        key: 'search',
        value: debouncedSearch ? { description: debouncedSearch } : undefined,
      },
      { type: 'set', key: 'page', value: 1 },
    ]);
  }, [debouncedSearch]);

  return (
    <InputGroup {...props}>
      <InputGroupInput
        placeholder="Search description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>

      {isLoading ? (
        <InputGroupAddon align={'inline-end'}>
          <RiLoaderLine className="animate-spin" />
        </InputGroupAddon>
      ) : search ? (
        <InputGroupAddon align="inline-end">
          {data?.totalItems ?? 0} results
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contents
/* -------------------------------------------------------------------------- */
function PermissionListTable() {
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
      columns={PermissionTableColumnDef}
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
