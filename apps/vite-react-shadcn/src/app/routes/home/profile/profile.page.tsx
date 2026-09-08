import { Container } from '@/components/layout/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  SessionItem,
  SessionItemActionMenu,
  SessionList,
  SessionListItemGroup,
} from '@/features/auth';
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

      <Container id="sessions" className="pb-4">
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Manage devices where you're signed in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList>
              <SessionListItemGroup separator>
                {(s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    slotRight={<SessionItemActionMenu session={s} />}
                  />
                )}
              </SessionListItemGroup>
            </SessionList>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ProfilePage;
