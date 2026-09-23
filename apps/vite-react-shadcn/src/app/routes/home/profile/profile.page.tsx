import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import {
  ProfileCard,
  ProfileCardSkeleton,
  useProfile,
} from '@/features/identity';

const ProfilePage = () => {
  const profile = useProfile('me', { silent: true });

  return (
    <>
      <PageHeading
        title="Profile"
        description="View and update your personal information"
      />

      <Container className="mb-4">
        {profile.isLoading && <ProfileCardSkeleton />}
        {profile.data && <ProfileCard profile={profile.data} />}
      </Container>
    </>
  );
};

export default ProfilePage;
