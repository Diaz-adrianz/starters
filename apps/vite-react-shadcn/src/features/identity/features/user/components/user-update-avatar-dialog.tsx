import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '../api/user.query';
import { LoadingOverlay } from '@/components/shared/loading';
import type { DialogState } from '@/hooks/use-dialog';
import { NotFoundResourceEmpty } from '@/components/shared/not-found-empty';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string';
import { Button } from '@/components/ui/button';

type UserUpdateAvatarDialogPayload = { id: string };

function UserUpdateAvatarDialog({
  open,
  onOpenChange,
  payload,
}: DialogState<UserUpdateAvatarDialogPayload>) {
  const { data, isLoading } = useUser(payload?.id ?? '', {
    enabled: !!payload?.id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Update Avatar</DialogTitle>
        </DialogHeader>

        {!data && !isLoading && open ? (
          <NotFoundResourceEmpty resource="Account" />
        ) : (
          <>
            <Avatar className="mx-auto mb-8 size-60">
              <AvatarImage src={data?.avatarUrl ?? ''} />
              <AvatarFallback className="text-5xl">
                {getInitials(data?.username ?? '')}
              </AvatarFallback>
            </Avatar>

            <DialogFooter>
              {data?.avatarUrl && (
                <Button variant={'destructive'} className="grow">
                  Remove
                </Button>
              )}
              <Button className="grow">Save</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { UserUpdateAvatarDialog };
export type { UserUpdateAvatarDialogPayload };
