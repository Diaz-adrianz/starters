import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  SessionItem,
  SessionItemSkeleton,
  SessionList,
  SessionListItemGroup,
  SessionListPagination,
  SessionMenu,
  useSessionMutations,
} from '@/features/auth';
import { useResourceQuery } from '@/lib/resource-query/hooks/use-resource-query';
import authStore from '@/stores/auth.store';

const SessionsPage = () => {
  const authUser = authStore((s) => s.user);

  const query = useResourceQuery({
      page: 1,
      limit: 10,
      eq: { userId: authUser?.id ?? '' },
      order: { lastUsedAt: 'desc' },
    }),
    mutations = useSessionMutations();

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
                className="mb-4"
                skeleton={<SessionItemSkeleton />}
              >
                {(s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    slotRight={
                      <SessionMenu
                        session={s}
                        actions={
                          s.isActive
                            ? { revoke: (s) => mutations.revoke(s) }
                            : { delete: (s) => mutations.del(s) }
                        }
                      />
                    }
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
