import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import type { ApiPaginatedResponse } from '@/lib/axios/api.type';
import type { Profile } from '../types/profile.type';
import { useProfiles } from '../api/profile.query';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import type { ConditionMap } from '@/lib/resource-query/resource-query.type';
import { DataTable } from '@/components/shared/data-table';
import { SearchInput } from '@/components/shared/search-input';
import { ResourceListTrashFilter } from '@/components/shared/resource-list';

/* -------------------------------------------------------------------------- */
/*  Context
/* -------------------------------------------------------------------------- */
type ProfileListContextProps = {
  query: ReturnType<typeof useResourceQuery>;
  data: ApiPaginatedResponse<Profile>['data'] | undefined;
  isLoading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

const ProfileListContext = createContext<ProfileListContextProps | null>(null);

function useProfileList() {
  const context = useContext(ProfileListContext);
  if (!context)
    throw new Error('useProfileList must be used within a ProfileList.');

  return context;
}

/* -------------------------------------------------------------------------- */
/*  Provider
/* -------------------------------------------------------------------------- */
function ProfileList({
  children,
  query: controlledQuery,
}: {
  children: ReactNode;
  query?: ReturnType<typeof useResourceQuery>;
}) {
  const internalQuery = useResourceQuery(),
    query = controlledQuery ?? internalQuery;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useProfiles(query.params);

  return (
    <ProfileListContext.Provider
      value={{
        query,
        data,
        isLoading,
        rowSelection,
        setRowSelection,
      }}
    >
      {children}
    </ProfileListContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters
/* -------------------------------------------------------------------------- */
function ProfileListSearchFilter() {
  const { isLoading, data, query } = useProfileList();

  return (
    <SearchInput
      isLoading={isLoading}
      resultsCount={data?.totalItems}
      onChange={(value) =>
        query.set(
          'search',
          value ? { firstName: value, lastName: value } : undefined
        )
      }
    />
  );
}

function ProfileListTrashFilter() {
  const { query } = useProfileList();

  return (
    <ResourceListTrashFilter
      value={query.state.trash}
      onValueChange={(s) => query.set('trash', s)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Contents
/* -------------------------------------------------------------------------- */
function ProfileListTable({
  columnDef,
}: {
  columnDef: ColumnDef<
    NonNullable<ProfileListContextProps['data']>['items'][number]
  >[];
}) {
  const { data, isLoading, query, rowSelection, setRowSelection } =
    useProfileList();

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
  ProfileList,
  ProfileListSearchFilter,
  ProfileListTrashFilter,
  ProfileListTable,
};
