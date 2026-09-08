import { Container } from '@/components/layout/container';
import { PageHeading } from '@/components/shared/page-heading';
import { UserCard, UserCardSkeleton, useUser } from '@/features/identity';
import authStore from '@/stores/auth.store';

const AccountsPage = () => {
  const authUser = authStore((s) => s.user);

  const user = useUser(authUser?.id ?? '');

  return (
    <>
      <PageHeading
        title="Accounts"
        description="Manage this app and connected external accounts"
      />

      <Container className="mb-4">
        {user.isLoading && <UserCardSkeleton />}
        {user.data?.data.data && <UserCard user={user.data.data.data} />}
      </Container>
    </>
  );
};

export default AccountsPage;
