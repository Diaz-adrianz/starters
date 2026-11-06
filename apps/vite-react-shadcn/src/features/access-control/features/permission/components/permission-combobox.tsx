import {
  AsyncCombobox,
  type AsyncComboboxProps,
} from '@/components/shared/async-combobox';
import type { Permission } from '../types/permission.type';
import { PermissionApi } from '../api/permission.api';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

type PermissionComboboxItem = Pick<Permission, 'id' | 'description' | 'module'>;

function PermissionCombobox({
  ...props
}: Omit<
  AsyncComboboxProps<PermissionComboboxItem>,
  'queryKey' | 'loadItems' | 'getItemKey' | 'getItemLabel'
>) {
  return (
    <AsyncCombobox<PermissionComboboxItem>
      queryKey={['permissions', 'options']}
      loadItems={async (s) => {
        const res = await PermissionApi.findMany({
          ...(s && { search: `description:${s};module:${s}` }),
          limit: 10,
        });
        return res.data.data.items;
      }}
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.description}
      renderItem={(item) => (
        <Item size="xs" className="p-0">
          <ItemContent>
            <ItemTitle>{item.description}</ItemTitle>
            <ItemDescription>{item.module}</ItemDescription>
          </ItemContent>
        </Item>
      )}
      {...props}
    />
  );
}

export { PermissionCombobox };
export type { PermissionComboboxItem };
