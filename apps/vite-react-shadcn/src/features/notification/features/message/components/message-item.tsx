import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { type ComponentProps, type ReactNode } from 'react';
import type { Message } from '../types/message.type';
import { RiCircleFill } from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';
import { dateToNow } from '@/utils/date';

export const MessageItem = ({
  message,
  slotMedia,
  slotBottom,
  slotRight,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  message: Pick<Message, 'id' | 'title' | 'body' | 'readAt'>;
  slotMedia?: ReactNode;
  slotBottom?: ReactNode;
  slotRight?: ReactNode;
  slotActions?: ReactNode;
}) => {
  return (
    <Item {...props} asChild>
      <a href="#">
        {slotMedia}
        <ItemContent>
          <ItemTitle>{message.title}</ItemTitle>
          <ItemDescription>{message.body}</ItemDescription>
          {slotBottom}
        </ItemContent>
        {!!slotRight && <ItemContent>{slotRight}</ItemContent>}
        {!!slotActions && <ItemActions>{slotActions}</ItemActions>}
      </a>
    </Item>
  );
};

export const MessageItemSkeleton = ({
  ...props
}: ComponentProps<typeof Item>) => {
  return (
    <Item {...props}>
      <ItemContent>
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="h-4 w-52" />
      </ItemContent>
    </Item>
  );
};

export const MessageItemUnreadIndicator = ({
  readAt,
  ...props
}: ComponentProps<typeof ItemMedia> & {
  readAt: Message['readAt'];
}) => {
  return (
    <ItemMedia {...props} variant={'icon'}>
      {!readAt && (
        <RiCircleFill className="size-2 animate-pulse text-destructive" />
      )}
    </ItemMedia>
  );
};

export const MessageItemCreatedDate = ({
  createdAt,
  ...props
}: ComponentProps<typeof ItemDescription> & {
  createdAt: Message['createdAt'];
}) => {
  return <ItemDescription {...props}>{dateToNow(createdAt)}</ItemDescription>;
};
