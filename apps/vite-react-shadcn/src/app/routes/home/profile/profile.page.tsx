import { Container } from '@/components/layout/container';
import { useUser, UserCard, UserCardSkeleton } from '@/features/identity';
import authStore from '@/stores/auth.store';

const ProfilePage = () => {
  const authUser = authStore((s) => s.user);
  const user = useUser(authUser?.id ?? '');

  return (
    <>
      <Container id="account">
        {user.isLoading && <UserCardSkeleton />}
        {user.data?.data.data && <UserCard user={user.data.data.data} />}
      </Container>
    </>
  );
};

export default ProfilePage;
