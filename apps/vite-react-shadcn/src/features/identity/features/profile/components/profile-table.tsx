import type { ColumnDef } from '@tanstack/react-table';
import type { Profile } from '../types/profile.type';
import { SortableHeader } from '@/components/shared/data-table';
import { ProfileMenu } from './profile-menu';

const ProfileTableColumnDef: ColumnDef<Profile>[] = [
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
    accessorKey: 'firstName',
    header: ({ column }) => (
      <SortableHeader column={column} title="First name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <SortableHeader column={column} title="Last name" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => <SortableHeader column={column} title="Gender" />,
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.gender}</p>
    ),
  },
  {
    id: 'action',
    header: '',
    cell: ({ row }) => <ProfileMenu profile={row.original} />,
    enableSorting: false,
  },
];

export { ProfileTableColumnDef };
