import { IlusOnlineProfile } from '@/assets/images';
import { Page, PageSection } from '@/components/shared/page';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  ProfileCard,
  ProfileCardSkeleton,
  useProfile,
  useUser,
} from '@/features/identity';
import { useParams } from 'react-router-dom';

const AccountProfilePage = () => {
  const params = useParams(),
    id = params.id!;

  const user = useUser(id),
    { data, isLoading } = useProfile(user.data?.profile?.id ?? '', {
      enabled: !!user.data?.profile?.id,
    });

  return (
    <Page className="pt-4">
      <PageSection>
        {(isLoading || user.isLoading) && <ProfileCardSkeleton />}
        {data ? (
          <ProfileCard profile={data} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <img src={IlusOnlineProfile} alt="" className="w-40" />
              </EmptyMedia>
              <EmptyTitle>No profile yet</EmptyTitle>
              <EmptyDescription>
                This account hasn't set up their profile.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </PageSection>
    </Page>
  );
};

export default AccountProfilePage;
