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
import type { Permission } from '../types/permission.type';
import { usePermissions } from '../api/permission.query';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';

// ======================================
// Context
// --------------------------------------
type PermissionListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Permission>['data'] | undefined;
  isLoading: boolean;
};

const PermissionListContext = createContext<PermissionListContextProps | null>(
  null
);

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissionList = () => {
  const context = useContext(PermissionListContext);
  if (!context)
    throw new Error('usePermissionList must be used within a PermissionList.');

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const PermissionList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const { data, isLoading } = usePermissions(query.params);

  return (
    <PermissionListContext.Provider value={{ query, data, isLoading }}>
      {children}
    </PermissionListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const PermissionListItemGroup = ({
  children,
  separator,
  skeleton,
  skeletonCount = 5,
  className,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (permission: Permission) => ReactNode;
  separator?: boolean;
  skeleton?: ReactNode;
  skeletonCount?: number;
}) => {
  const { data, isLoading } = usePermissionList();

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
export const PermissionListSearchBox = ({
  ...props
}: ComponentProps<typeof InputGroup>) => {
  const { isLoading, data, query } = usePermissionList();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    query.setField(
      'search',
      debouncedSearch ? { description: debouncedSearch } : undefined
    );
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
};

// ======================================
// Pagination
// --------------------------------------
export const PermissionListPagination = () => {
  const { query, isLoading, data } = usePermissionList();
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
