import type { ColumnDef } from '@tanstack/react-table';
import type { Role } from '../types/role.type';
import { SortableHeader } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { RoleMenu } from './role-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RiArrowRightLine } from '@remixicon/react';

const RoleTableColumnDef: ColumnDef<Role>[] = [
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
    cell: ({ row }) => (
      <>
        <Button size={'icon'} variant={'ghost'} asChild>
          <Link to={`/admin/access/roles/${row.original.id}`}>
            <RiArrowRightLine />
          </Link>
        </Button>
        <RoleMenu role={row.original} />
      </>
    ),
    enableSorting: false,
  },
];

export { RoleTableColumnDef };
