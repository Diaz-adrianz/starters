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
import type { Profile } from '../types/profile.type';
import { useProfiles } from '../api/profile.query';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';

// ======================================
// Context
// --------------------------------------
type ProfileListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Profile>['data'] | undefined;
  isLoading: boolean;
};

const ProfileListContext = createContext<ProfileListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileList = () => {
  const context = useContext(ProfileListContext);
  if (!context)
    throw new Error('useProfileList must be used within a ProfileList.');

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const ProfileList = ({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) => {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const { data, isLoading } = useProfiles(query.params);

  return (
    <ProfileListContext.Provider value={{ query, data, isLoading }}>
      {children}
    </ProfileListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const ProfileListItemGroup = ({
  children,
  separator,
  skeleton,
  skeletonCount = 5,
  className,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (profile: Profile) => ReactNode;
  separator?: boolean;
  skeleton?: ReactNode;
  skeletonCount?: number;
}) => {
  const { data, isLoading } = useProfileList();

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
export const ProfileListSearchBox = ({
  ...props
}: ComponentProps<typeof InputGroup>) => {
  const { isLoading, data, query } = useProfileList();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    query.batch([
      {
        type: 'set',
        key: 'search',
        value: debouncedSearch
          ? { firstName: debouncedSearch, lastName: debouncedSearch }
          : undefined,
      },
      { type: 'set', key: 'page', value: 1 },
    ]);
  }, [debouncedSearch]);

  return (
    <InputGroup {...props}>
      <InputGroupInput
        placeholder="Search name..."
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
export const ProfileListPagination = () => {
  const { query, isLoading, data } = useProfileList();
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
    onPageChange: (p) => query.set('page', p),
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
