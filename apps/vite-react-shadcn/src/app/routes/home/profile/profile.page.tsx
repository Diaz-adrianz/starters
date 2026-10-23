import { Page, PageHeader, PageSection } from '@/components/shared/page';
import {
  ProfileCard,
  ProfileCardSkeleton,
  useProfile,
} from '@/features/identity';

const ProfilePage = () => {
  const profile = useProfile('me', { silent: true });

  return (
    <Page>
      <PageHeader
        title="Profile"
        description="View and update your personal information"
      />
      <PageSection>
        {profile.isLoading && <ProfileCardSkeleton />}
        {profile.data && <ProfileCard profile={profile.data} />}
      </PageSection>
    </Page>
  );
};

export default ProfilePage;
