import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { useRolePermission } from '../api/role-permission.query';
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
import { JsonBlock } from '@/components/shared/json-block';

type RolePermissionDialogPayload = { id: string };

function RolePermissionDialog({
  open,
  onOpenChange,
  payload,
}: DialogState<RolePermissionDialogPayload>) {
  const { data, isLoading } = useRolePermission(payload?.id ?? '', {
    enabled: !!payload?.id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Role Permission Detail</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          {!data ? (
            <NotFoundResourceEmpty resource="RolePermission" />
          ) : (
            <>
              <ItemGroup className="mb-4 rounded-2xl border py-2">
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Added</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      {formatDate(data.createdAt, 'PPPp')}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Role</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>{data.role?.name}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'}>
                  <ItemContent>
                    <ItemTitle>Permission</ItemTitle>
                  </ItemContent>
                  <ItemContent className="items-end">
                    <ItemTitle>{data.permission?.description}</ItemTitle>
                    <ItemDescription>{data.permission?.module}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator className="m-0" />
                <Item size={'xs'} className="scrollbar-none overflow-x-auto">
                  <ItemContent>
                    <ItemTitle>Condition</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    {data.condition && <JsonBlock value={data.condition} />}
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

export { RolePermissionDialog };
export type { RolePermissionDialogPayload };
