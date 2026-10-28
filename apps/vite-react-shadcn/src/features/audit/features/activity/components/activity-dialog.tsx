import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { useActivity } from '../api/activity.query';
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
import {
  ActivityActorTypeMap,
  ActivityStatusMap,
} from '../constants/activity.constant';
import { formatDate } from '@/utils/date';
import { cn } from 'cn';
import { JsonBlock } from '@/components/shared/json-block';
import { InlineLink } from '@/components/shared/inline-link';

type ActivityDialogPayload = { id: string };

function ActivityDialog({
  open,
  onOpenChange,
  payload,
}: DialogState<ActivityDialogPayload>) {
  const { data, isLoading } = useActivity(payload?.id ?? '', {
    enabled: !!payload?.id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Activity Detail</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          {!data ? (
            <NotFoundResourceEmpty resource="Activity" />
          ) : (
            <>
              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Timestamp</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.createdAt, 'EEE, dd MMM yyyy, HH:mm')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Status</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription
                      className={cn(
                        'font-bold text-foreground uppercase',
                        ActivityStatusMap[data.status].meta?.className
                      )}
                    >
                      {ActivityStatusMap[data.status].label}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Actor type</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {ActivityActorTypeMap[data.actorType].label}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Actor ID</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.actorId}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Actor name</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {data.actorType === 'user' ? (
                        <InlineLink
                          to={`/admin/identity/accounts/${data.actorId}`}
                        >
                          {data.actorName}
                        </InlineLink>
                      ) : (
                        data.actorName
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Module</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.module}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Action</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.action}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Target type</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.targetType}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Target ID</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.targetId}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Target name</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.targetName}</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="overflow-hidden rounded-2xl border py-2">
                <Item size={'xs'} className="scrollbar-none overflow-x-auto">
                  <ItemContent>
                    <ItemTitle>Context</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <JsonBlock value={data.context} />
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Changes</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <JsonBlock value={data.changes} />
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Meta</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <JsonBlock value={data.meta} />
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

export { ActivityDialog };
export type { ActivityDialogPayload };
