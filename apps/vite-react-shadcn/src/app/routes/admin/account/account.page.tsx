import { Page, PageSection } from '@/components/shared/page';
import { UserCard, UserCardSkeleton, useUser } from '@/features/identity';
import { useParams } from 'react-router-dom';

const AccountPage = () => {
  const params = useParams(),
    id = params.id!;

  const { data, isLoading } = useUser(id);

  return (
    <Page className="pt-4">
      <PageSection>
        {isLoading && <UserCardSkeleton />}
        {data && <UserCard user={data} />}
      </PageSection>
    </Page>
  );
};

export default AccountPage;
