import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { fcmStore } from '@/lib/firebase/stores/fcm.store';
import { RiNotificationBadgeLine } from '@remixicon/react';

const SettingsNotificationPage = () => {
  const fcmLoading = fcmStore((s) => s.loading),
    fcmEnabled = fcmStore((s) => s.enabled),
    fcmToggle = fcmStore((s) => s.toggle);

  return (
    <Page>
      <PageHeader title="Notification Settings" />

      <PageSection>
        <Card>
          <CardContent>
            <ItemGroup>
              <Item size={'xs'}>
                <ItemMedia variant="icon">
                  <RiNotificationBadgeLine className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Push</ItemTitle>
                  <ItemDescription>
                    Get notified in this browser, even when the tab is closed.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    disabled={fcmLoading}
                    checked={fcmEnabled}
                    onCheckedChange={fcmToggle}
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default SettingsNotificationPage;
