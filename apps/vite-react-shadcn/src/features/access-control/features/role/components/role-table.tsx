import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { Role } from '../types/role.type';
import { SortableHeader } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';

type RoleTableColumnDefProps = {
  action?: (op: CellContext<Role, unknown>) => React.JSX.Element;
};
const RoleTableColumnDef = (
  props?: RoleTableColumnDefProps
): ColumnDef<Role>[] => [
  {
    id: 'no',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'enabled',
    header: () => 'Status',
    cell: ({ row }) =>
      row.original.enabled ? (
        <Badge>Active</Badge>
      ) : (
        <Badge variant={'secondary'}>Inactive</Badge>
      ),
    enableSorting: false,
  },
  {
    accessorKey: 'default',
    header: () => 'Default',
    cell: ({ row }) => (row.original.default ? 'Yes' : 'No'),
    enableSorting: false,
  },
  {
    id: 'action',
    header: '',
    cell: props?.action,
    enableSorting: false,
  },
];

export { RoleTableColumnDef };
export type { RoleTableColumnDefProps };
