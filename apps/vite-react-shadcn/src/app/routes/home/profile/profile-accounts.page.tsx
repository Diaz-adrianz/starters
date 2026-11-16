import { Page, PageHeader, PageSection } from '@/components/shared/page';
import {
  UserActions,
  UserCard,
  UserCardSkeleton,
  UserUpdateAvatarDialog,
  useUser,
  type UserUpdateAvatarDialogPayload,
} from '@/features/identity';
import { useDialogState } from '@/hooks/use-dialog';
import authStore from '@/stores/auth.store';
import { RiSettings4Line } from '@remixicon/react';

const ProfileAccountsPage = () => {
  const authUser = authStore((s) => s.user);

  const updateAvatarDialog = useDialogState<UserUpdateAvatarDialogPayload>();

  const user = useUser(authUser?.id ?? '');

  return (
    <Page className="not-md:pt-8">
      <UserUpdateAvatarDialog {...updateAvatarDialog} />

      <PageHeader
        title="Accounts"
        description="Manage this app and connected external accounts"
        action={
          user.data && (
            <UserActions
              collapsed={['updateAvatar']}
              CollapsedIcon={RiSettings4Line}
              handlers={{
                updateAvatar: () =>
                  updateAvatarDialog.show({ id: user.data.id }),
              }}
            />
          )
        }
      />
      <PageSection>
        {user.isLoading && <UserCardSkeleton hides={['status']} />}
        {user.data && <UserCard user={user.data} hides={['status']} />}
      </PageSection>
    </Page>
  );
};

export default ProfileAccountsPage;
