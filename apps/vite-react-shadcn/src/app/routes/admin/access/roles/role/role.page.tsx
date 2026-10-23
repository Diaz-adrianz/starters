import { Page, PageSection } from '@/components/shared/page';
import { RoleCard, RoleCardSkeleton, useRole } from '@/features/access-control';
import { useParams } from 'react-router-dom';

const RolePage = () => {
  const params = useParams();

  const roleId = params.id!,
    role = useRole(roleId);

  return (
    <Page>
      <PageSection>
        {role.isLoading && <RoleCardSkeleton />}
        {role.data && <RoleCard role={role.data} />}
      </PageSection>
    </Page>
  );
};

export default RolePage;
