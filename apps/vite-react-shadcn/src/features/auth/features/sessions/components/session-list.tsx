import {
  createContext,
  Fragment,
  useContext,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { Session } from '../types/session.type';
import { useSessions } from '../api/session.query';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import { DataTable } from '@/components/shared/data-table';
import { ResourceListPagination } from '@/components/shared/resource-list';
import { usePagination } from '@/hooks/use-pagination';

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type SessionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Session>['data'] | undefined;
  isLoading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const SessionListContext = createContext<SessionListContextProps | null>(null);

function useSessionList() {
  const context = useContext(SessionListContext);
  if (!context)
    throw new Error('useSessionList must be used within a SessionList.');

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function SessionList({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useSessions(query.params);

  return (
    <SessionListContext.Provider
      value={{
        query,
        data,
        isLoading,
        rowSelection,
        setRowSelection,
      }}
    >
      {children}
    </SessionListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content
/* -------------------------------------------------------------------------- */
function SessionListItemGroup({
  children,
  skeleton,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (session: Session) => ReactNode;
  skeleton?: ReactNode;
}) {
  const { data, isLoading, query } = useSessionList();
  return (
    <ItemGroup {...props}>
      {isLoading
        ? Array.from({ length: query.state.limit }).map((_, i) => (
            <Fragment key={i}>{skeleton}</Fragment>
          ))
        : data?.items.map((s, i) => (
            <Fragment key={s.id}>
              {children(s)}
              {i < data.items.length - 1 && <ItemSeparator className="m-0" />}
            </Fragment>
          ))}
    </ItemGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pagination
/* -------------------------------------------------------------------------- */
function SessionListPagination() {
  const { query, data } = useSessionList();
  const pagination = {
    pageIndex: query.state.page - 1,
    pageSize: query.state.limit,
  };

  const table = usePagination({
    pagination,
    onPaginationChange: (up) => {
      const p = typeof up === 'function' ? up(pagination) : up;
      query.batch([
        { type: 'set', key: 'page', value: p.pageIndex + 1 },
        { type: 'set', key: 'limit', value: p.pageSize },
      ]);
    },
    pageCount: data?.totalPages ?? 0,
  });

  return (
    <ResourceListPagination
      total={data?.totalItems ?? 0}
      page={pagination.pageIndex + 1}
      onPrev={
        table.getCanPreviousPage() ? () => table.previousPage() : undefined
      }
      onNext={table.getCanNextPage() ? () => table.nextPage() : undefined}
    />
  );
}

function SessionListTable({
  columnDef,
}: {
  columnDef: ColumnDef<
    NonNullable<SessionListContextProps['data']>['items'][number]
  >[];
}) {
  const { data, isLoading, query, rowSelection, setRowSelection } =
    useSessionList();

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
  SessionList,
  SessionListItemGroup,
  SessionListPagination,
  SessionListTable,
};
