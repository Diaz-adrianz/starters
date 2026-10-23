import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
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
    <Page className="min-h-svh">
      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Identity' },
          { label: 'Profiles' },
        ]}
      />
      <PageHeader title="Profiles" />
      <PageSection>
        <Card>
          <CardContent>
            <ProfileList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <ProfileListSearchBox />
              </div>
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
            </ProfileList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default ProfilesPage;
