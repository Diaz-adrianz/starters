import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { FcmEnablerSetting } from '@/lib/firebase/components/fcm-settings';

const SettingsNotificationPage = () => {
  return (
    <Page>
      <PageHeader title="Notification Settings" />

      <PageSection>
        <Card>
          <CardContent>
            <ItemGroup>
              <FcmEnablerSetting />
            </ItemGroup>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default SettingsNotificationPage;
