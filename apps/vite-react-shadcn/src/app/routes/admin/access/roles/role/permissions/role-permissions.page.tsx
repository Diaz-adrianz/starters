import { Can } from '@/components/shared/can';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RolePermissionItem,
  RolePermissionItemActionMenu,
  RolePermissionItemSkeleton,
  RolePermissionList,
  RolePermissionListItemGroup,
  RolePermissionListPagination,
  RolePermissionListSearchBox,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';
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
    <>
      <RolePermissionList roleId={roleId} query={query}>
        <Container className="mt-8 mb-4" orientation={'horizontal'}>
          <RolePermissionListSearchBox />

          <Can I={'update'} a={'access-control:role'}>
            <Button>
              <RiAddLine /> Add permission
            </Button>
          </Can>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <RolePermissionListItemGroup
                separator
                skeleton={<RolePermissionItemSkeleton />}
                className="mb-8"
              >
                {(rolePermission) => (
                  <RolePermissionItem
                    rolePermission={rolePermission}
                    slotActions={
                      <RolePermissionItemActionMenu
                        rolePermission={rolePermission}
                      />
                    }
                  />
                )}
              </RolePermissionListItemGroup>
              <RolePermissionListPagination />
            </CardContent>
          </Card>
        </Container>
      </RolePermissionList>
    </>
  );
};

export default RolePermissionsPage;
