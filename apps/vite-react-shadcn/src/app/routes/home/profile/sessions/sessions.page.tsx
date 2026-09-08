import { Container } from '@/components/layout/container';
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

const SessionsPage = () => {
  return (
    <>
      <PageHeading
        title="Sessions"
        description="Manage devices where you're signed in"
      />

      <Container>
        <Card>
          <CardContent>
            <SessionList>
              <SessionListItemGroup
                skeleton={<SessionItemSkeleton />}
                separator
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
            </SessionList>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default SessionsPage;
