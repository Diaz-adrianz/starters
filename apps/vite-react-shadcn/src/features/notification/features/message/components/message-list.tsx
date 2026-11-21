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
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Message } from '../types/message.type';
import { useMessages } from '../api/message.query';
import type { RowSelectionState } from '@tanstack/react-table';
import { Chip, ChipGroup } from '@/components/shared/chip';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { RiInbox2Line } from '@remixicon/react';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import { usePagination } from '@/hooks/use-pagination';
import { ResourceListPagination } from '@/components/shared/resource-list';

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type MessageListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Message>['data'] | undefined;
  isLoading: boolean;
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

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useMessages(query.params);

  return (
    <MessageListContext.Provider
      value={{
        query,
        data,
        isLoading,
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
  const { data, isLoading, query } = useMessageList();
  return (
    <ItemGroup {...props}>
      {isLoading ? (
        Array.from({ length: query.state.limit }).map((_, i) => (
          <Fragment key={i}>{skeleton}</Fragment>
        ))
      ) : data?.items.length ? (
        data?.items.map((item, i) => (
          <Fragment key={item.id}>
            {children(item)}
            {i < data?.items.length - 1 && <ItemSeparator className="m-0" />}
          </Fragment>
        ))
      ) : (
        <>{empty}</>
      )}
    </ItemGroup>
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
  const { query, data } = useMessageList();
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

export {
  MessageList,
  MessageListReadFilter,
  MessageListItemGroup,
  MessageListEmpty,
  MessageListPagination,
};
