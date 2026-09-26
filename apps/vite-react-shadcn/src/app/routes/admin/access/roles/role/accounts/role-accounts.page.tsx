import { Can } from '@/components/shared/can';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserItem,
  RoleUserList,
  RoleUserListItemGroup,
  RoleUserListPagination,
  RoleUserListSearchBox,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';
import { useParams } from 'react-router-dom';

const RoleAccountsPage = () => {
  const params = useParams();

  const roleId = params.id!,
    query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    });

  return (
    <>
      <RoleUserList roleId={roleId} query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <RoleUserListSearchBox />

          <Can I={'update'} a={'access-control:role'}>
            <Button>
              <RiAddLine /> Add account
            </Button>
          </Can>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <RoleUserListItemGroup>
                {(roleUser) => <RoleUserItem roleUser={roleUser} />}
              </RoleUserListItemGroup>

              <RoleUserListPagination />
            </CardContent>
          </Card>
        </Container>
      </RoleUserList>
    </>
  );
};

export default RoleAccountsPage;
