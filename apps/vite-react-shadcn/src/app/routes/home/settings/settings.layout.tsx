import { Container } from '@/components/layout/container';
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
    <div className="min-h-svh bg-muted">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full pt-4 md:w-1/4">
            <Tabs
              defaultValue={activeMenu}
              orientation={isMobile ? 'horizontal' : 'vertical'}
            >
              <TabsList variant={'line'} className="w-full">
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
    </div>
  );
};

export default SettingsLayout;
