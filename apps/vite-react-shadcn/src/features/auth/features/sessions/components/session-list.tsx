import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { Session } from '../types/session.type';
import { useSessions } from '../api/session.query';
import { useResourceQuery } from '@/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type SessionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Session>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const SessionListContext = createContext<SessionListContextProps | null>(null);

const useSessionList = () => {
  const context = useContext(SessionListContext);
  if (!context)
    throw new Error('useSessionList must be used within a SessionList.');

  return context;
};

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

  const { data, isLoading } = useSessions(query.params);

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
    <SessionListContext.Provider
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
    </SessionListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content
/* -------------------------------------------------------------------------- */
function SessionListContent({
  children,
}: {
  children: (
    opts: {
      items: NonNullable<SessionListContextProps['data']>['items'];
    } & Pick<SessionListContextProps, 'isLoading' | 'pagination'>
  ) => ReactNode;
}) {
  const { data, isLoading, pagination } = useSessionList();

  return children({ items: data?.items ?? [], isLoading, pagination });
}

function SessionListItemGroup({
  children,
  skeleton,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (session: Session) => ReactNode;
  skeleton?: ReactNode;
}) {
  return (
    <SessionListContent>
      {({ items, isLoading, pagination }) => (
        <ItemGroup {...props}>
          {isLoading
            ? Array.from({ length: pagination.pageSize }).map((_, i) => (
                <Fragment key={i}>{skeleton}</Fragment>
              ))
            : items.map((s, i) => (
                <Fragment key={s.id}>
                  {children(s)}
                  {i < items.length - 1 && <ItemSeparator className="m-0" />}
                </Fragment>
              ))}
        </ItemGroup>
      )}
    </SessionListContent>
  );
}

export { SessionList, SessionListItemGroup };
