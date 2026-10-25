import { Page, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  RolePermissionList,
  RolePermissionListSearchFilter,
  RolePermissionListTable,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { useParams } from 'react-router-dom';

const RolePermissionsPage = () => {
  const params = useParams();

  const roleId = params.id!,
    query = useResourceQuery({
      page: 1,
      limit: 10,
      order: { createdAt: 'desc' },
    });

  return (
    <Page className="pt-4">
      <PageSection className="mb-4">
        <Card>
          <CardContent>
            <RolePermissionList roleId={roleId} query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <RolePermissionListSearchFilter />
              </div>
              <RolePermissionListTable />
            </RolePermissionList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default RolePermissionsPage;
