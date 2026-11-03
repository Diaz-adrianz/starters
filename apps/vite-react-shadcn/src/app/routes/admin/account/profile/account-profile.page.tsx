import { IlusOnlineProfile } from '@/assets/images';
import { Page, PageSection } from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  ProfileCard,
  ProfileCardSkeleton,
  ProfileUpdateDialog,
  useProfile,
  useUser,
  type ProfileUpdateDialogPayload,
} from '@/features/identity';
import { useDialogState } from '@/hooks/use-dialog';
import { Can } from '@casl/react';
import { RiEdit2Line } from '@remixicon/react';
import { useParams } from 'react-router-dom';

const AccountProfilePage = () => {
  const params = useParams(),
    id = params.id!;

  const updateDialog = useDialogState<ProfileUpdateDialogPayload>();

  const user = useUser(id),
    { data, isLoading } = useProfile(user.data?.profile?.id ?? '', {
      enabled: !!user.data?.profile?.id,
    });

  return (
    <Page className="pt-4">
      <ProfileUpdateDialog {...updateDialog} />

      <PageSection>
        {(isLoading || user.isLoading) && <ProfileCardSkeleton />}
        {data ? (
          <>
            <div className="flex flex-wrap justify-end gap-2">
              <Can I={'update'} a={'identity:profile'}>
                <Button
                  variant={'outline'}
                  onClick={() => updateDialog.show({ id: data.id })}
                >
                  <RiEdit2Line /> Edit
                </Button>
              </Can>
            </div>
            <ProfileCard profile={data} />
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <img src={IlusOnlineProfile} alt="" className="w-40" />
              </EmptyMedia>
              <EmptyTitle>No profile yet</EmptyTitle>
              <EmptyDescription>
                This account hasn't set up their profile.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </PageSection>
    </Page>
  );
};

export default AccountProfilePage;
