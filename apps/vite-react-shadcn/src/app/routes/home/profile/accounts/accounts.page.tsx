import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { UserCard, UserCardSkeleton, useUser } from '@/features/identity';
import authStore from '@/stores/auth.store';

const AccountsPage = () => {
  const authUser = authStore((s) => s.user);

  const user = useUser(authUser?.id ?? '');

  return (
    <Page>
      <PageHeader
        title="Accounts"
        description="Manage this app and connected external accounts"
      />
      <PageSection>
        {user.isLoading && <UserCardSkeleton />}
        {user.data?.data.data && <UserCard user={user.data.data.data} />}
      </PageSection>
    </Page>
  );
};

export default AccountsPage;
