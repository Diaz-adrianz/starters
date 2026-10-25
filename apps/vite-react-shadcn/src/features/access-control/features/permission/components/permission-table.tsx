import type { ColumnDef } from '@tanstack/react-table';
import type { Permission } from '../types/permission.type';
import { SortableHeader } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { PermissionMenu } from './permission-menu';

const PermissionTableColumnDef: ColumnDef<Permission>[] = [
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
    accessorKey: 'description',
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'module',
    header: ({ column }) => <SortableHeader column={column} title="Module" />,
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.module}</p>
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
    id: 'action',
    header: '',
    cell: ({ row }) => <PermissionMenu permission={row.original} />,
    enableSorting: false,
  },
];

export { PermissionTableColumnDef };
