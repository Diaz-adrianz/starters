import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '../types/user.type';
import { SortableHeader } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from './user-menu';

const UserTableColumnDef: ColumnDef<User>[] = [
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
    accessorKey: 'username',
    header: ({ column }) => <SortableHeader column={column} title="User" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.email}</p>
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
    cell: ({ row }) => <UserMenu user={row.original} />,
    enableSorting: false,
  },
];

export { UserTableColumnDef };
