import { Container } from '@/components/shared/container';
import { RoleCard, RoleCardSkeleton, useRole } from '@/features/access-control';
import { useParams } from 'react-router-dom';

const RolePage = () => {
  const params = useParams();

  const roleId = params.id!,
    role = useRole(roleId);

  return (
    <>
      <Container className="mt-8 mb-4">
        {role.isLoading && <RoleCardSkeleton />}
        {role.data && <RoleCard role={role.data} />}
      </Container>
    </>
  );
};

export default RolePage;
