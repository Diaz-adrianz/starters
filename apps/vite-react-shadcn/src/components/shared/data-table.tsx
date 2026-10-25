import { Button } from '@/components/ui/button';
import {
  RiArrowDownLongLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLongLine,
} from '@remixicon/react';
import {
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '../ui/pagination';

function SortableHeader<T>({
  column,
  title,
}: {
  column: Column<T, unknown>;
  title: string;
}) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => {
        if (!sorted) column.toggleSorting(false);
        else if (sorted === 'asc') column.toggleSorting(true);
        else column.clearSorting();
      }}
    >
      {title}
      {sorted === 'asc' ? (
        <RiArrowUpLongLine className="ml-2 size-4" />
      ) : sorted === 'desc' ? (
        <RiArrowDownLongLine className="ml-2 size-4" />
      ) : (
        <RiArrowUpDownLine className="ml-2 size-4 opacity-50" />
      )}
    </Button>
  );
}

function DataTable<TData>({
  columns,
  data,
  pageCount,
  totalItems,
  getRowId,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  rowSelection = {},
  onRowSelectionChange,
  isLoading,
}: {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageCount: number;
  totalItems: number;
  getRowId: (row: TData) => string;
  pagination: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  isLoading?: boolean;
}) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    getRowId,
    state: { pagination, sorting, rowSelection },
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    enableRowSelection: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  const pages = useMemo((): (number | null)[] => {
    if (pageCount <= 0) return [];

    const siblingCount = 1,
      totalSlots = siblingCount * 2 + 5;

    if (pageCount <= totalSlots)
      return Array.from({ length: pageCount }, (_, i) => i);

    const leftSibling = Math.max(pagination.pageIndex - siblingCount, 0),
      rightSibling = Math.min(
        pagination.pageIndex + siblingCount,
        pageCount - 1
      );

    const showLeftEllipsis = leftSibling > 1,
      showRightEllipsis = rightSibling < pageCount - 2;

    const result: (number | null)[] = [0];

    if (showLeftEllipsis) result.push(null);
    else for (let i = 1; i < leftSibling; i++) result.push(i);

    for (
      let i = Math.max(leftSibling, 1);
      i <= Math.min(rightSibling, pageCount - 2);
      i++
    )
      result.push(i);

    if (showRightEllipsis) result.push(null);
    else for (let i = rightSibling + 1; i < pageCount - 1; i++) result.push(i);

    if (pageCount > 1) result.push(pageCount - 1);

    return result;
  }, [pagination.pageIndex, pageCount]);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      {column.columnDef.meta?.skeleton ?? (
                        <Skeleton className="h-5 w-full" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="typo-caption text-muted-foreground">
          {selectedCount > 0 && `${selectedCount} selected ·`} {totalItems}{' '}
          total
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
              {pages.map((p, i) => (
                <PaginationItem key={i}>
                  {p === null ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      size={'icon-sm'}
                      isActive={pagination.pageIndex === p}
                      onClick={() => table.setPageIndex(p)}
                    >
                      {p + 1}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
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
    </div>
  );
}

export { SortableHeader, DataTable };
