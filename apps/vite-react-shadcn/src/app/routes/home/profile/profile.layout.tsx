import { Outlet } from 'react-router-dom';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiComputerFill,
  RiComputerLine,
  RiKeyFill,
  RiKeyLine,
} from '@remixicon/react';
import { useMenu } from '@/hooks/use-menu';
import type { Menu } from '@/types/menu.type';
import { TabLayout } from '@/components/shared/tab-layout';
import { Page, PageSection } from '@/components/shared/page';

const Menu: Menu[] = [
  {
    path: '/profile',
    label: 'Profile',
    Icon: RiAccountCircleLine,
    IconActive: RiAccountCircleFill,
  },
  {
    path: '/profile/accounts',
    label: 'Accounts',
    Icon: RiKeyLine,
    IconActive: RiKeyFill,
  },
  {
    path: '/profile/sessions',
    label: 'Sessions',
    Icon: RiComputerLine,
    IconActive: RiComputerFill,
  },
];

const ProfileLayout = () => {
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

export default ProfileLayout;
