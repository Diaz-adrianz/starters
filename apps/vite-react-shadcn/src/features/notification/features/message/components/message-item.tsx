import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { type ComponentProps, type ReactNode } from 'react';
import type { Message } from '../types/message.type';
import { Skeleton } from '@/components/ui/skeleton';
import { dateToNow } from '@/utils/date';
import { useMarkReadMessage } from '../api/message.mutation';

function MessageItem({
  message,
  slotBottom,
  slotRight,
  ...props
}: ComponentProps<typeof Item> & {
  message: Pick<Message, 'id' | 'title' | 'body' | 'readAt'>;
  slotBottom?: ReactNode;
  slotRight?: ReactNode;
}) {
  const markRead = useMarkReadMessage();

  const onClick = () => {
    markRead.mutate({ id: message.id });
  };

  const unRead = !message.readAt;

  return (
    <Item size={'xs'} {...props} asChild>
      <a href="#" onClick={onClick}>
        <ItemContent>
          <ItemTitle className={unRead ? 'font-bold' : 'text-muted-foreground'}>
            {message.title}
          </ItemTitle>
          <ItemDescription className={unRead ? 'text-foreground' : ''}>
            {message.body}
          </ItemDescription>
          {slotBottom}
        </ItemContent>
        {!!slotRight && <ItemContent>{slotRight}</ItemContent>}
      </a>
    </Item>
  );
}

function MessageItemSkeleton({ ...props }: ComponentProps<typeof Item>) {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="h-4 w-52" />
      </ItemContent>
    </Item>
  );
}

function MessageItemCreatedDate({
  createdAt,
  ...props
}: ComponentProps<typeof ItemDescription> & {
  createdAt: Message['createdAt'];
}) {
  return <ItemDescription {...props}>{dateToNow(createdAt)}</ItemDescription>;
}

export { MessageItem, MessageItemSkeleton, MessageItemCreatedDate };
