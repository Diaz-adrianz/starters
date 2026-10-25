import type { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/shared/data-table';
import { RolePermissionMenu } from './role-permission-menu';
import type { RolePermission } from '../types/role.type';
import { formatDate } from '@/utils/date';

const RolePermissionTableColumnDef: ColumnDef<RolePermission>[] = [
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
    id: 'permission.description',
    header: ({ column }) => (
      <SortableHeader column={column} title="Permission" />
    ),
    cell: ({ row }) => row.original.permission.description,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader column={column} title="Added date" />
    ),
    cell: ({ row }) => (
      <p className="text-muted-foreground">
        Added at {formatDate(row.original.createdAt, 'dd MMM yyyy HH:mm')}
      </p>
    ),
  },
  {
    id: 'action',
    header: '',
    cell: ({ row }) => <RolePermissionMenu rolePermission={row.original} />,
    enableSorting: false,
  },
];

export { RolePermissionTableColumnDef };
