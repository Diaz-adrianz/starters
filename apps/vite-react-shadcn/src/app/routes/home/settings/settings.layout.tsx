import { Container } from '@/components/shared/container';
import { TabsLinkLayout } from '@/components/shared/tabs-layout';
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
    <Container padding={'none'} className="min-h-svh bg-muted">
      <TabsLinkLayout menus={menus} activePath={activeMenu?.path}>
        <Outlet />
      </TabsLinkLayout>
    </Container>
  );
};

export default SettingsLayout;
