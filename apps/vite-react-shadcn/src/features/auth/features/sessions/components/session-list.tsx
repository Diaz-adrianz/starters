import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import {
  createContext,
  Fragment,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import type { Session } from '../types/session.type';
import { useSessions } from '../api/session.query';
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

// ======================================
// Context
// --------------------------------------
type SessionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Session>['data'] | undefined;
  isLoading: boolean;
};

const SessionListContext = createContext<SessionListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionList = () => {
  const context = useContext(SessionListContext);
  if (!context)
    throw new Error('useSessionList must be used within a SessionList.');

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const SessionList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const { data, isLoading } = useSessions(query.params);

  return (
    <SessionListContext.Provider value={{ query, data, isLoading }}>
      {children}
    </SessionListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const SessionListItemGroup = ({
  children,
  separator,
  skeleton,
  skeletonCount = 5,
  className,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (session: Session) => ReactNode;
  separator?: boolean;
  skeleton?: ReactNode;
  skeletonCount?: number;
}) => {
  const { data, isLoading } = useSessionList();

  return (
    <ItemGroup className={cn('relative', className)} {...props}>
      {!!skeleton &&
        isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <Fragment key={i}>{skeleton}</Fragment>
        ))}

      {data?.items.map((s, i) => {
        return (
          <Fragment key={s.id}>
            {children(s)}
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
export const SessionListPagination = () => {
  const { query, isLoading, data } = useSessionList();
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
