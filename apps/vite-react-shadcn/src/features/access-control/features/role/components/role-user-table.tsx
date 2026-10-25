import type { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/shared/data-table';
import { RoleUserMenu } from './role-user-menu';
import type { RoleUser } from '../types/role.type';
import { formatDate } from '@/utils/date';

const RoleUserTableColumnDef: ColumnDef<RoleUser>[] = [
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
    id: 'user.username',
    header: ({ column }) => <SortableHeader column={column} title="User" />,
    cell: ({ row }) => row.original.username,
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
    cell: ({ row }) => <RoleUserMenu roleUser={row.original} />,
    enableSorting: false,
  },
];

export { RoleUserTableColumnDef };
