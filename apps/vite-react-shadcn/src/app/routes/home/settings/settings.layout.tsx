import { Page, PageSection } from '@/components/shared/page';
import { TabLayout } from '@/components/shared/tab-layout';
import { useMenu } from '@/hooks/use-menu';
import type { Menu } from '@/types/menu.type';
import { RiSettings4Fill, RiSettings4Line } from '@remixicon/react';
import { Outlet } from 'react-router-dom';

const Menu: Menu[] = [
  {
    path: '/settings',
    label: 'General',
    Icon: RiSettings4Line,
    IconActive: RiSettings4Fill,
  },
];
const SettingsLayout = () => {
  const { menus, activeMenu } = useMenu(Menu);

  return (
    <Page className="min-h-svh pt-0">
      <PageSection dense>
        <TabLayout menus={menus} activeMenu={activeMenu}>
          <Outlet />
        </TabLayout>
      </PageSection>
    </Page>
  );
};

export default SettingsLayout;
