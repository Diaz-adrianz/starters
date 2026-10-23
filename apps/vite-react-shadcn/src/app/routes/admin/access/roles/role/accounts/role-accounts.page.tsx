import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  RoleUserItem,
  RoleUserItemActionMenu,
  RoleUserItemSkeleton,
  RoleUserList,
  RoleUserListItemGroup,
  RoleUserListPagination,
  RoleUserListSearchBox,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
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
    <Page>
      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <RoleUserList roleId={roleId} query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <RoleUserListSearchBox />
              </div>

              <RoleUserListItemGroup
                separator
                skeleton={<RoleUserItemSkeleton />}
                className="mb-8"
              >
                {(roleUser) => (
                  <RoleUserItem
                    roleUser={roleUser}
                    slotActions={<RoleUserItemActionMenu roleUser={roleUser} />}
                  />
                )}
              </RoleUserListItemGroup>
              <RoleUserListPagination />
            </RoleUserList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RoleAccountsPage;
