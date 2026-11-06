import {
  AsyncCombobox,
  type AsyncComboboxProps,
} from '@/components/shared/async-combobox';
import type { Role } from '../types/role.type';
import { RoleApi } from '../api/role.api';

type RoleComboboxItem = Pick<Role, 'id' | 'name'>;

function RoleCombobox({
  ...props
}: Omit<
  AsyncComboboxProps<RoleComboboxItem>,
  'queryKey' | 'loadItems' | 'getItemKey' | 'getItemLabel'
>) {
  return (
    <AsyncCombobox<RoleComboboxItem>
      queryKey={['roles', 'options']}
      loadItems={async (s) => {
        const res = await RoleApi.findMany({
          ...(s && { search: `name:${s}` }),
          limit: 10,
        });
        return res.data.data.items;
      }}
      getItemKey={(r) => r.id}
      getItemLabel={(r) => r.name}
      {...props}
    />
  );
}

export { RoleCombobox };
export type { RoleComboboxItem };
