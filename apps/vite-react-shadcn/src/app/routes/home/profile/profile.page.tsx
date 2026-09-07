import { Container } from '@/components/layout/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SessionList,
  SessionListItem,
  SessionListItemGroup,
  SessionListRowDropdownMenu,
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

      <Container id="sessions">
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionList>
              <SessionListItemGroup>
                {(s) => (
                  <SessionListItem
                    key={s.id}
                    session={s}
                    slotRight={<SessionListRowDropdownMenu session={s} />}
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
