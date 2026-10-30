import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { useSession } from '../api/session.query';
import { LoadingOverlay } from '@/components/shared/loading';
import { NotFoundResourceEmpty } from '@/components/shared/not-found-empty';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';
import { UserItem, UserMenu, useUser } from '@/features/identity';

type SessionDialogPayload = { id: string };

function SessionDialog({
  open,
  onOpenChange,
  payload,
}: DialogState<SessionDialogPayload>) {
  const { data, isLoading } = useSession(payload?.id ?? '', {
    enabled: !!payload?.id && open,
  });
  const user = useUser(data?.userId ?? '', {
    enabled: !!data?.userId,
    silent: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Session Detail</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          {!data ? (
            <NotFoundResourceEmpty resource="Session" />
          ) : (
            <>
              {user.data && (
                <UserItem
                  variant={'outline'}
                  className="mb-4"
                  user={user.data}
                  slotActions={
                    <UserMenu
                      user={user.data}
                      actions={{
                        read: `/admin/iam/accounts/${user.data.id}`,
                      }}
                    />
                  }
                />
              )}

              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Device</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {data.deviceLabel || 'Unknown'}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Device type</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.deviceType}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>OS</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.os}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Browser</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.browser}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>IP address</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.ipAddress}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'} className="no-scrollbar overflow-auto">
                  <ItemContent>
                    <ItemTitle>User agent</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.userAgent}</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Status</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    {data.isActive ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant={'secondary'}>Inactive</Badge>
                    )}
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Last used</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.lastUsedAt, 'd MMM yyyy, hh:mm a')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Expired</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.expiresAt, 'd MMM yyyy, hh:mm a')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SessionDialog };
export type { SessionDialogPayload };
