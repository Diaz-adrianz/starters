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
import { useEffect, useRef } from 'react';
import { useUpload } from '@/features/storage';
import type { MimeType } from '@/constants/mimetype.constant';

const MIME_TYPES: MimeType[] = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_SIZE = 3 * 1024 * 1024;

type UserUpdateAvatarDialogPayload = { id: string };

function UserUpdateAvatarDialog({
  open,
  onOpenChange,
  payload,
}: DialogState<UserUpdateAvatarDialogPayload>) {
  const { data, isLoading } = useUser(payload?.id ?? '', {
    enabled: !!payload?.id && open,
  });

  const upload = useUpload({
    mimeTypes: MIME_TYPES,
    maxSize: MAX_SIZE,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) upload.reset();
  }, [open]);

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) upload.select(file);
  };

  const save = async () => {
    const key = await upload.submit();
    console.log(key);
  };

  const remove = async () => {};

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
            <button
              type="button"
              className="mx-auto mb-8 block overflow-hidden rounded-full"
              disabled={upload.isLoading}
              onClick={() => inputRef.current?.click()}
            >
              {upload.isLoading && <LoadingOverlay text="Uploading..." />}
              <Avatar className="size-60">
                <AvatarImage src={upload.preview ?? data?.avatarUrl ?? ''} />
                <AvatarFallback className="text-5xl">
                  {getInitials(data?.username ?? '')}
                </AvatarFallback>
              </Avatar>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept={MIME_TYPES.join(',')}
              hidden
              onChange={selectFile}
            />

            <DialogFooter>
              {data?.avatarUrl && (
                <Button
                  variant={'destructive'}
                  className="grow"
                  disabled={upload.isLoading}
                  onClick={() => remove()}
                >
                  Remove
                </Button>
              )}
              <Button
                className="grow"
                disabled={!upload.file || upload.isLoading}
                onClick={() => save()}
              >
                Save
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { UserUpdateAvatarDialog };
export type { UserUpdateAvatarDialogPayload };
