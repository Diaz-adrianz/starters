import { Container } from '@/components/shared/container';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveMenuPath } from '@/hooks/use-active-menu-path';
import { useIsMobile } from '@/hooks/use-mobile';
import { RiSettings4Line } from '@remixicon/react';
import { Link, Outlet } from 'react-router-dom';

const Menu = [
  {
    Icon: RiSettings4Line,
    path: '/settings',
    label: 'General',
  },
];
const SettingsLayout = () => {
  const isMobile = useIsMobile(),
    activeMenu = useActiveMenuPath(Menu);

  return (
    <Container padding={'none'} className="min-h-svh bg-muted">
      <div className="flex flex-col md:flex-row">
        <div className="overflow-x-auto pt-4 md:sticky md:top-16 md:h-fit md:w-1/4">
          <Tabs
            value={activeMenu}
            orientation={isMobile ? 'horizontal' : 'vertical'}
            className="border-b border-sidebar-border md:border-r md:border-b-0 md:ps-4"
          >
            <TabsList variant={'line'} className="w-full justify-start">
              {Menu.map((menu) => (
                <TabsTrigger key={menu.path} value={menu.path} asChild>
                  <Link to={menu.path}>
                    <menu.Icon /> {menu.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="w-full md:w-3/4">
          <Outlet />
        </div>
      </div>
    </Container>
  );
};

export default SettingsLayout;
