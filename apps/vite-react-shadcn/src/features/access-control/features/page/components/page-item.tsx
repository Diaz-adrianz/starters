import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { Page } from '../types/page.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiMore2Line } from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Can } from '@/components/shared/can';

export const PageItem = ({
  page,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  page: Pick<Page, 'id' | 'name' | 'description'>;
  slotActions?: ReactNode;
}) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>{page.name}</ItemTitle>
        <ItemDescription>{page.description}</ItemDescription>
      </ItemContent>
      {slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
};

export const PageItemSkeleton = ({ ...props }: ComponentProps<typeof Item>) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </ItemContent>
    </Item>
  );
};

// ======================================
// Actions
// --------------------------------------
export const PageItemActionMenu = ({
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  page: Pick<Page, 'id' | 'enabled'>;
  trigger?: ReactNode;
}) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size={'icon'}>
            <RiMore2Line />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Can I={'update'} a={'access-control:page'} passThrough>
          {({ isAllowed }) => (
            <DropdownMenuItem disabled={!isAllowed}>Edit</DropdownMenuItem>
          )}
        </Can>
        <Can I={'archive'} a={'access-control:page'} passThrough>
          {({ isAllowed }) => (
            <DropdownMenuItem disabled={!isAllowed} variant="destructive">
              Remove
            </DropdownMenuItem>
          )}
        </Can>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
