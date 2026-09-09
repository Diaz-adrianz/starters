import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import {
  createContext,
  Fragment,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { useResourceQuery } from '@/hooks/use-resource-query';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import { usePagination } from '@/hooks/use-pagination';
import { Button } from '@/components/ui/button';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { cn } from 'cn';
import type { Message } from '../types/message.type';
import { useMessages } from '../api/message.query';

// ======================================
// Context
// --------------------------------------
type MessageListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Message>['data'] | undefined;
  isLoading: boolean;
};

const MessageListContext = createContext<MessageListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageList = () => {
  const context = useContext(MessageListContext);
  if (!context)
    throw new Error('useMessageList must be used within a MessageList.');

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const MessageList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const { data, isLoading } = useMessages(query.params);

  return (
    <MessageListContext.Provider value={{ query, data, isLoading }}>
      {children}
    </MessageListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const MessageListItemGroup = ({
  children,
  separator,
  skeleton,
  skeletonCount = 5,
  empty,
  className,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (message: Message) => ReactNode;
  separator?: boolean;
  skeleton?: ReactNode;
  skeletonCount?: number;
  empty?: ReactNode;
}) => {
  const { data, isLoading } = useMessageList();

  return (
    <ItemGroup className={cn('relative', className)} {...props}>
      {!!skeleton &&
        isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <Fragment key={i}>{skeleton}</Fragment>
        ))}

      {(data?.items.length ?? 0) <= 0 && !isLoading && empty}

      {data?.items.map((d, i) => {
        return (
          <Fragment key={d.id}>
            {children(d)}
            {separator && i < data.items.length - 1 && (
              <ItemSeparator className="m-0" />
            )}
          </Fragment>
        );
      })}
    </ItemGroup>
  );
};

// ======================================
// Pagination
// --------------------------------------
export const MessageListPagination = () => {
  const { query, isLoading, data } = useMessageList();
  const {
    page,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    pages,
    jumpToPage,
  } = usePagination({
    initPage: query.state.page,
    initLimit: query.state.limit,
    totalItems: data?.totalItems ?? 0,
    onPageChange: (p) => query.setField('page', p),
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={'ghost'}
            disabled={!hasPrevPage || isLoading}
            onClick={prevPage}
          >
            <RiArrowLeftSLine /> Previous
          </Button>
        </PaginationItem>
        {pages.map((p, i) => (
          <PaginationItem key={i}>
            {p === null ? (
              <PaginationEllipsis />
            ) : (
              <Button
                disabled={isLoading}
                size={'icon-sm'}
                variant={page === p ? 'default' : 'ghost'}
                onClick={() => jumpToPage(p)}
              >
                {p}
              </Button>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant={'ghost'}
            disabled={!hasNextPage || isLoading}
            onClick={nextPage}
          >
            Next <RiArrowRightSLine />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
