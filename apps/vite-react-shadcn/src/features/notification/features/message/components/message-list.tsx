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
import { useResourceQuery } from '@/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Message } from '../types/message.type';
import { useMessages } from '../api/message.query';
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { Chip, ChipGroup } from '@/components/shared/chip';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiInbox2Line,
} from '@remixicon/react';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import { usePagination } from '@/hooks/use-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

const DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type MessageListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Message>['data'] | undefined;
  isLoading: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const MessageListContext = createContext<MessageListContextProps | null>(null);

function useMessageList() {
  const context = useContext(MessageListContext);
  if (!context)
    throw new Error('useMessageList must be used within a MessageList.');

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function MessageList({
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

  const { data, isLoading } = useMessages(query.params);

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
    <MessageListContext.Provider
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
    </MessageListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
function MessageListReadFilter() {
  const { query } = useMessageList();

  const [status, setStatus] = useState('unread');

  useEffect(() => {
    query.batch([
      status === 'unread'
        ? { type: 'add', key: 'eq', field: 'readAt', value: null }
        : { type: 'del', key: 'eq', field: 'readAt' },
      { type: 'set', key: 'page', value: 1 },
    ]);
  }, [status]);

  return (
    <ChipGroup value={status} onValueChanged={setStatus}>
      <Chip value="unread">Unread</Chip>
      <Chip value="all">All</Chip>
    </ChipGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content
/* -------------------------------------------------------------------------- */
function MessageListContent({
  children,
}: {
  children: (
    opts: {
      items: NonNullable<MessageListContextProps['data']>['items'];
    } & Pick<MessageListContextProps, 'isLoading' | 'pagination'>
  ) => ReactNode;
}) {
  const { data, isLoading, pagination } = useMessageList();

  return children({ items: data?.items ?? [], isLoading, pagination });
}

function MessageListItemGroup({
  children,
  skeleton,
  empty,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (item: Message) => ReactNode;
  skeleton?: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <MessageListContent>
      {({ items, isLoading, pagination }) => (
        <ItemGroup {...props}>
          {isLoading ? (
            Array.from({ length: pagination.pageSize }).map((_, i) => (
              <Fragment key={i}>{skeleton}</Fragment>
            ))
          ) : items.length ? (
            items.map((item, i) => (
              <Fragment key={item.id}>
                {children(item)}
                {i < items.length - 1 && <ItemSeparator className="m-0" />}
              </Fragment>
            ))
          ) : (
            <>{empty}</>
          )}
        </ItemGroup>
      )}
    </MessageListContent>
  );
}

function MessageListEmpty({ title = 'No messages yet' }: { title?: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={'icon'}>
          <RiInbox2Line />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pagination
/* -------------------------------------------------------------------------- */
function MessageListPagination() {
  const { pagination, setPagination, data } = useMessageList();
  const table = usePagination({
    pagination,
    onPaginationChange: setPagination,
    pageCount: data?.totalPages ?? 0,
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="typo-caption text-muted-foreground">
        {data?.totalItems ?? 0} total
      </p>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size={'icon-sm'}
                variant={'outline'}
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <RiArrowLeftSLine />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{pagination.pageIndex + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <Button
                size={'icon-sm'}
                variant={'outline'}
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <RiArrowRightSLine />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export {
  MessageList,
  MessageListReadFilter,
  MessageListItemGroup,
  MessageListEmpty,
  MessageListPagination,
};
