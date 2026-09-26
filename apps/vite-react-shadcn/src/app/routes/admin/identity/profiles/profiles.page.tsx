import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Card, CardContent } from '@/components/ui/card';
import {
  ProfileItem,
  ProfileItemActionMenu,
  ProfileItemSkeleton,
  ProfileList,
  ProfileListItemGroup,
  ProfileListPagination,
  ProfileListSearchBox,
} from '@/features/identity';
import { useResourceQuery } from '@/hooks/use-resource-query';

const ProfilesPage = () => {
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
          { label: 'Identity' },
          { label: 'Profiles' },
        ]}
        title="Profiles"
      />

      <ProfileList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <ProfileListSearchBox />
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <ProfileListItemGroup
                separator
                skeleton={<ProfileItemSkeleton />}
                className="mb-8"
              >
                {(profile) => (
                  <ProfileItem
                    key={profile.id}
                    profile={profile}
                    slotActions={<ProfileItemActionMenu profile={profile} />}
                  />
                )}
              </ProfileListItemGroup>
              <ProfileListPagination />
            </CardContent>
          </Card>
        </Container>
      </ProfileList>
    </>
  );
};

export default ProfilesPage;
