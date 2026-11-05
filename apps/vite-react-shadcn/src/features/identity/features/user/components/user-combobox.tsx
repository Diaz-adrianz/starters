import {
  AsyncCombobox,
  type AsyncComboboxProps,
} from '@/components/shared/async-combobox';
import type { User } from '../types/user.type';
import { UserApi } from '../api/user.api';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string';

type UserComboboxItem = Pick<User, 'id' | 'username' | 'avatar'>;

function UserCombobox({
  ...props
}: Omit<
  AsyncComboboxProps<UserComboboxItem>,
  'queryKey' | 'loadItems' | 'getItemKey' | 'getItemLabel'
>) {
  return (
    <AsyncCombobox<UserComboboxItem>
      queryKey={['users', 'options']}
      loadItems={async (s) => {
        const res = await UserApi.findMany({
          ...(s && { search: `username:${s}` }),
          limit: 10,
        });
        return res.data.data.items;
      }}
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.username}
      renderItem={(item) => (
        <Item size="xs" className="p-0">
          <ItemMedia>
            <Avatar size="sm">
              <AvatarImage src={item.avatar ?? ''} alt="" />
              <AvatarFallback>{getInitials(item.username)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{item.username}</ItemTitle>
          </ItemContent>
        </Item>
      )}
      {...props}
    />
  );
}

export { UserCombobox };
export type { UserComboboxItem };
