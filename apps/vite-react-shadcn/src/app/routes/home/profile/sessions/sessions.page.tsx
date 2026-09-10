import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Card, CardContent } from '@/components/ui/card';
import {
  SessionItem,
  SessionItemActionMenu,
  SessionItemSkeleton,
  SessionList,
  SessionListItemGroup,
  SessionListPagination,
} from '@/features/auth';
import { useResourceQuery } from '@/hooks/use-resource-query';
import authStore from '@/stores/auth.store';

const SessionsPage = () => {
  const authUser = authStore((s) => s.user);

  const query = useResourceQuery({
    page: 1,
    limit: 10,
    where: { userId: authUser?.id ?? '' },
    order: { lastUsedAt: 'desc' },
  });

  return (
    <>
      <PageHeading
        title="Sessions"
        description="Manage devices where you're signed in"
      />

      <Container className="mb-4">
        <SessionList query={query}>
          <Card>
            <CardContent>
              <SessionListItemGroup
                skeleton={<SessionItemSkeleton />}
                separator
                className="mb-4"
              >
                {(s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    slotRight={<SessionItemActionMenu session={s} />}
                  />
                )}
              </SessionListItemGroup>
              <SessionListPagination />
            </CardContent>
          </Card>
        </SessionList>
      </Container>
    </>
  );
};

export default SessionsPage;
