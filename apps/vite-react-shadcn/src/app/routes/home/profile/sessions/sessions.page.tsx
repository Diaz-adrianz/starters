import { Page, PageHeader, PageSection } from '@/components/shared/page';
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
    eq: { userId: authUser?.id ?? '' },
    order: { lastUsedAt: 'desc' },
  });

  return (
    <Page>
      <PageHeader
        title="Sessions"
        description="Manage devices where you're signed in"
      />

      <PageSection>
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
      </PageSection>
    </Page>
  );
};

export default SessionsPage;
