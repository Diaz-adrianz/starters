import type { ComponentProps } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '../ui/pagination';
import { Button } from '../ui/button';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

function ResourceListTrashFilter({
  value,
  onValueChange,
  ...props
}: Omit<ComponentProps<typeof Tabs>, 'value' | 'onValueChange'> & {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}) {
  return (
    <Tabs
      {...props}
      value={value ? 'trash' : 'active'}
      onValueChange={(v) => onValueChange?.(v === 'trash')}
    >
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger
          value="trash"
          className="data-[state=active]:text-destructive!"
        >
          Trash
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function ResourceListPagination({
  total,
  page,
  onPrev,
  onNext,
}: {
  total: number;
  page: number;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="typo-caption text-muted-foreground">{total} total</p>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size={'icon-sm'}
                variant={'outline'}
                disabled={!onPrev}
                onClick={() => onPrev?.()}
              >
                <RiArrowLeftSLine />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <Button
                size={'icon-sm'}
                variant={'outline'}
                disabled={!onNext}
                onClick={() => onNext?.()}
              >
                <RiArrowRightSLine />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export { ResourceListTrashFilter, ResourceListPagination };
