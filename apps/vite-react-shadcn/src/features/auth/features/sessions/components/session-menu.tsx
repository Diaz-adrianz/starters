import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRemoveSession, useRevokeSession } from '../api/session.mutation';
import { toast } from 'sonner';
import type { ComponentProps, ReactNode } from 'react';
import type { Session } from '../types/session.type';
import { RiMore2Line } from '@remixicon/react';

function SessionMenu({
  session,
  trigger,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  session: Pick<Session, 'id' | 'isActive'>;
  trigger?: ReactNode;
}) {
  const remove = useRemoveSession(),
    revoke = useRevokeSession();

  const onRemove = () => {
    toast.promise(remove.mutateAsync(session.id), {
      loading: 'Deleting...',
      success: 'Deleted',
    });
  };

  const onRevoke = () => {
    toast.promise(revoke.mutateAsync({ id: session.id }), {
      loading: 'Terminating...',
      success: 'Terminated',
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
        {session.isActive ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={revoke.isPending}
            onClick={onRevoke}
          >
            Terminate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            disabled={remove.isPending}
            onClick={onRemove}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { SessionMenu };
