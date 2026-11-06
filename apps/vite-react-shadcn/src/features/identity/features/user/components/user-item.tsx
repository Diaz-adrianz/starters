import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps, ReactNode } from 'react';
import type { User } from '../types/user.type';
import { getInitials } from '@/utils/string';

function UserItem({
  user,
  slotActions,
  ...props
}: ComponentProps<typeof Item> & {
  user: Pick<User, 'id' | 'avatar' | 'username' | 'email'>;
  slotActions?: ReactNode;
}) {
  return (
    <Item {...props}>
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src={user.avatar ?? ''} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{user.username}</ItemTitle>
        <ItemDescription>{user.email}</ItemDescription>
      </ItemContent>
      {!!slotActions && <ItemActions>{slotActions}</ItemActions>}
    </Item>
  );
}

export { UserItem };
