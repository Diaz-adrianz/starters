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
import { formatDate } from '@/utils/date';
import { cn } from 'cn';
import { JsonBlock } from '@/components/shared/json-block';
import { InlineLink } from '@/components/shared/inline-link';
import { ActivityOutcomeMap } from '../constants/activity.constant';

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
                    <ItemTitle>Occured date</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.occuredAt, 'PPPppp')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Recorded date</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.loggedAt, 'PPPppp')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Request ID</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.requestId}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Outcome</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription
                      className={cn(
                        'font-bold text-foreground uppercase',
                        ActivityOutcomeMap[data.outcome].meta?.className
                      )}
                    >
                      {ActivityOutcomeMap[data.outcome].label}
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
                <Item size={'xs'} className="scrollbar-none overflow-x-auto">
                  <ItemContent>
                    <ItemTitle>Context</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <JsonBlock value={data.context} />
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Actor type</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.actorType}</ItemDescription>
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
                        <InlineLink to={`/admin/iam/accounts/${data.actorId}`}>
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
                    <ItemTitle>Action</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.action}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Resource</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.resourceType}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Resource ID</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.resourceId}</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <ItemGroup className="overflow-hidden rounded-2xl border py-2">
                <Item size={'xs'} className="scrollbar-none overflow-x-auto">
                  <ItemContent>
                    <ItemTitle>Metadata</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <JsonBlock value={data.metadata} />
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
