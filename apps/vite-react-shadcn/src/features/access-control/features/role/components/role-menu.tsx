import type { ComponentProps, ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiMore2Line } from '@remixicon/react';
import { Can } from '@/components/shared/can';
import type { Role } from '../types/role.type';
import { Link } from 'react-router-dom';
import { useConfirm } from '@/components/shared/confirm';
import { toast } from 'sonner';
import { useArchiveRole } from '../api/role.mutation';

function RoleMenu({
  role,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  role: Pick<Role, 'id' | 'name' | 'enabled'>;
  trigger?: ReactNode;
}) {
  const confirm = useConfirm();
  const archiveApi = useArchiveRole();

  const archive = async () => {
    const ok = await confirm({
      title: 'Remove role?',
      description: `Remove "${role.name}"? You can restore it later.`,
    });
    if (ok)
      toast.promise(archiveApi.mutateAsync({ id: role.id }), {
        loading: 'Removing role...',
        success: 'Role removed',
      });
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size={'icon'}>
            <RiMore2Line />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={`/admin/access/roles/${role.id}/accounts`}>Accounts</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/admin/access/roles/${role.id}/permissions`}>
              Permissions
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Can I={'update'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem disabled={!isAllowed}>Edit</DropdownMenuItem>
            )}
          </Can>
          <Can I={'update'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem
                disabled={!isAllowed}
                variant={role.enabled ? 'destructive' : 'default'}
              >
                {role.enabled ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            )}
          </Can>
          <Can I={'archive'} a={'access-control:role'} passThrough>
            {({ isAllowed }) => (
              <DropdownMenuItem
                variant="destructive"
                disabled={!isAllowed}
                onClick={archive}
              >
                Remove
              </DropdownMenuItem>
            )}
          </Can>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { RoleMenu };
