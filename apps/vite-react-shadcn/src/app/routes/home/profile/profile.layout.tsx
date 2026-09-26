import { Container } from '@/components/shared/container';
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
import { TabsLinkLayout } from '@/components/shared/tabs-layout';

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
    <Container padding={'none'} className="min-h-svh bg-muted">
      <TabsLinkLayout menus={menus} activePath={activeMenu?.path}>
        <Outlet />
      </TabsLinkLayout>
    </Container>
  );
};

export default ProfileLayout;
