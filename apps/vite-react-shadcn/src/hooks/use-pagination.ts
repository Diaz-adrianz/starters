import { useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  page: number;
  limit: number;
  totalItems: number;
  siblingCount?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const ELLIPSIS = null;

export const usePagination = ({
  page,
  limit,
  totalItems,
  siblingCount = 1,
  onPageChange,
  onLimitChange,
}: UsePaginationOptions) => {
  const totalPages =
    totalItems > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 0;

  const hasNextPage = totalPages > 0 && page < totalPages;
  const hasPrevPage = totalPages > 0 && page > 1;

  const jumpToPage = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(1, target), totalPages);
      onPageChange?.(clamped);
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (!hasNextPage) return;
    onPageChange?.(page + 1);
  }, [hasNextPage, page, onPageChange]);

  const prevPage = useCallback(() => {
    if (!hasPrevPage) return;
    onPageChange?.(page - 1);
  }, [hasPrevPage, page, onPageChange]);

  const changeLimit = useCallback(
    (newLimit: number) => {
      onLimitChange?.(newLimit);
      onPageChange?.(1);
    },
    [onLimitChange, onPageChange]
  );

  const pages = useMemo((): (number | null)[] => {
    if (totalPages <= 0) return [];

    const totalSlots = siblingCount * 2 + 5;

    if (totalPages <= totalSlots)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const result: (number | null)[] = [1];

    if (showLeftEllipsis) result.push(ELLIPSIS);
    else for (let i = 2; i < leftSibling; i++) result.push(i);

    for (
      let i = Math.max(leftSibling, 2);
      i <= Math.min(rightSibling, totalPages - 1);
      i++
    )
      result.push(i);

    if (showRightEllipsis) result.push(ELLIPSIS);
    else for (let i = rightSibling + 1; i < totalPages; i++) result.push(i);

    if (totalPages > 1) result.push(totalPages);

    return result;
  }, [page, totalPages, siblingCount]);

  return {
    page,
    limit,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    jumpToPage,
    changeLimit,
    pages,
  };
};
