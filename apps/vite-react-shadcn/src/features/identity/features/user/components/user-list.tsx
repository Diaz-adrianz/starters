import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useState,
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
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLoaderLine,
  RiSearchLine,
} from '@remixicon/react';
import { cn } from 'cn';
import type { User } from '../types/user.type';
import { useUsers } from '../api/user.query';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';

// ======================================
// Context
// --------------------------------------
type UserListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<User>['data'] | undefined;
  isLoading: boolean;
};

const UserListContext = createContext<UserListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) throw new Error('useUserList must be used within a UserList.');

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const UserList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const { data, isLoading } = useUsers(query.params);

  return (
    <UserListContext.Provider value={{ query, data, isLoading }}>
      {children}
    </UserListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const UserListItemGroup = ({
  children,
  separator,
  skeleton,
  skeletonCount = 5,
  className,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (user: User) => ReactNode;
  separator?: boolean;
  skeleton?: ReactNode;
  skeletonCount?: number;
}) => {
  const { data, isLoading } = useUserList();

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
export const UserListSearchBox = ({
  ...props
}: ComponentProps<typeof InputGroup>) => {
  const { isLoading, data, query } = useUserList();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    query.setField(
      'search',
      debouncedSearch ? { username: debouncedSearch } : undefined
    );
  }, [debouncedSearch]);

  return (
    <InputGroup {...props}>
      <InputGroupInput
        placeholder="Search username..."
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

// ======================================
// Pagination
// --------------------------------------
export const UserListPagination = () => {
  const { query, isLoading, data } = useUserList();
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
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">
        {data?.totalItems ?? 0} results
      </p>
      <div>
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
      </div>
    </div>
  );
};
