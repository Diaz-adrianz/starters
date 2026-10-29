import { IlusOnlineProfile } from '@/assets/images';
import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  ProfileCard,
  ProfileCardSkeleton,
  ProfileCreateDialog,
  ProfileUpdateDialog,
  useProfile,
  type ProfileUpdateDialogPayload,
} from '@/features/identity';
import { useDialogState } from '@/hooks/use-dialog';
import { Can } from '@casl/react';
import { RiEdit2Line } from '@remixicon/react';

const ProfilePage = () => {
  const createDialog = useDialogState(),
    updateDialog = useDialogState<ProfileUpdateDialogPayload>();

  const profile = useProfile('me', { silent: true });

  return (
    <Page>
      <ProfileCreateDialog
        {...createDialog}
        onSuccess={() => profile.refetch()}
      />
      <ProfileUpdateDialog
        {...updateDialog}
        onSuccess={() => profile.refetch()}
      />

      <PageHeader
        title="Profile"
        description="View and update your personal information"
        action={
          <>
            {profile.data && (
              <Can I={'update'} a={'identity:profile'}>
                <Button
                  variant={'outline'}
                  onClick={() => updateDialog.show({ id: profile.data.id })}
                >
                  <RiEdit2Line /> Edit
                </Button>
              </Can>
            )}
          </>
        }
      />
      <PageSection>
        {profile.isLoading && <ProfileCardSkeleton />}
        {profile.data ? (
          <ProfileCard profile={profile.data} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <img src={IlusOnlineProfile} alt="" className="w-40" />
              </EmptyMedia>
              <EmptyTitle>No profile yet</EmptyTitle>
              <EmptyDescription>
                Set up your profile to personalize your account.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => createDialog.show()}>
                Set up profile
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </PageSection>
    </Page>
  );
};

export default ProfilePage;
