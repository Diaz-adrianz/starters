import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';

function usePagination({
  pagination,
  onPaginationChange,
  pageCount,
}: {
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  pageCount: number;
}) {
  return useReactTable({
    data: [],
    columns: [],
    pageCount,
    state: { pagination },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
}

export { usePagination };
