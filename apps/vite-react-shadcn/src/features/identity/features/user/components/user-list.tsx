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
import type { User } from '../types/user.type';
import { useUsers } from '../api/user.query';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import type {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { DataTable } from '@/components/shared/data-table';
import { UserTableColumnDef } from './user-table';

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type UserListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<User>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const UserListContext = createContext<UserListContextProps | null>(null);

const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) throw new Error('useUserList must be used within a UserList.');

  return context;
};

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
const UserList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
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

  const { data, isLoading } = useUsers(query.params);

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
    <UserListContext.Provider
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
    </UserListContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
const UserListSearchFilter = ({
  ...props
}: ComponentProps<typeof InputGroup>) => {
  const { isLoading, data, query } = useUserList();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    query.batch([
      {
        type: 'set',
        key: 'search',
        value: debouncedSearch
          ? { username: debouncedSearch, email: debouncedSearch }
          : undefined,
      },
      { type: 'set', key: 'page', value: 1 },
    ]);
  }, [debouncedSearch]);

  return (
    <InputGroup {...props}>
      <InputGroupInput
        placeholder="Search username, email..."
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
};

/* -------------------------------------------------------------------------- */
/*  Contents
/* -------------------------------------------------------------------------- */
const UserListTable = () => {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
  } = useUserList();

  const sortingChange: OnChangeFn<SortingState> = (updater) =>
    setSorting(updater);

  const paginationChange: OnChangeFn<PaginationState> = (updater) =>
    setPagination(updater);

  const rowSelectionChange: OnChangeFn<RowSelectionState> = (updater) =>
    setRowSelection(updater);

  return (
    <DataTable
      columns={UserTableColumnDef}
      data={data?.items ?? []}
      pageCount={data?.totalPages ?? 0}
      totalItems={data?.totalItems ?? 0}
      getRowId={(row) => row.id}
      pagination={pagination}
      onPaginationChange={paginationChange}
      sorting={sorting}
      onSortingChange={sortingChange}
      rowSelection={rowSelection}
      onRowSelectionChange={rowSelectionChange}
      isLoading={isLoading}
    />
  );
};

export { UserList, UserListSearchFilter, UserListTable };
