import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Card, CardContent } from '@/components/ui/card';
import {
  PermissionItem,
  PermissionItemActionMenu,
  PermissionItemSkeleton,
  PermissionList,
  PermissionListItemGroup,
  PermissionListPagination,
  PermissionListSearchBox,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';

const PermissionsPage = () => {
  const query = useResourceQuery({
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHeading
        breadcrumb={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Access' },
          { label: 'Permissions' },
        ]}
        title="Permissions"
      />

      <PermissionList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <PermissionListSearchBox />
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <PermissionListItemGroup
                separator
                skeleton={<PermissionItemSkeleton />}
                className="mb-8"
              >
                {(permission) => (
                  <PermissionItem
                    key={permission.id}
                    permission={permission}
                    slotActions={
                      <PermissionItemActionMenu permission={permission} />
                    }
                  />
                )}
              </PermissionListItemGroup>
              <PermissionListPagination />
            </CardContent>
          </Card>
        </Container>
      </PermissionList>
    </>
  );
};

export default PermissionsPage;
