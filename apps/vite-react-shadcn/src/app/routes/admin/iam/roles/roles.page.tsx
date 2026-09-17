import { Can } from '@/components/shared/can';
import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleList,
  RoleListSearchBox,
  RoleListItemGroup,
  RoleItemSkeleton,
  RoleItem,
  RoleItemActionMenu,
  RoleListPagination,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';

const RolesPage = () => {
  const query = useResourceQuery({
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHeading title="Roles" />

      <RoleList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <RoleListSearchBox />
          <Can I={'create'} a={'identity:role'}>
            <Button>
              <RiAddLine /> Create role
            </Button>
          </Can>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <RoleListItemGroup
                separator
                skeleton={<RoleItemSkeleton className="p-0" />}
                className="mb-8"
              >
                {(role) => (
                  <RoleItem
                    key={role.id}
                    role={role}
                    className="p-0"
                    slotActions={<RoleItemActionMenu role={role} />}
                  />
                )}
              </RoleListItemGroup>
              <RoleListPagination />
            </CardContent>
          </Card>
        </Container>
      </RoleList>
    </>
  );
};

export default RolesPage;
