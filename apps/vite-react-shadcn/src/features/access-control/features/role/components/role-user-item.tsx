import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps } from 'react';
import type { RoleUser } from '../types/role.type';
import { formatDate } from '@/utils/date';

export const RoleUserItem = ({
  roleUser,
  ...props
}: ComponentProps<typeof Item> & {
  roleUser: Pick<RoleUser, 'username' | 'userId' | 'createdAt'>;
}) => {
  return (
    <Item size={'xs'} {...props}>
      <ItemContent>
        <ItemTitle>{roleUser.username}</ItemTitle>
        <ItemDescription>
          Added at {formatDate(roleUser.createdAt, 'dd MMM yyyy HH:mm')}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};
