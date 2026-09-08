import { Container } from '@/components/layout/container';
import { Outlet } from 'react-router-dom';
import {
  RiAccountCircleLine,
  RiComputerLine,
  RiKeyLine,
} from '@remixicon/react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveMenuPath } from '@/hooks/use-active-menu-path';

const Menu = [
  {
    Icon: RiAccountCircleLine,
    path: '/profile',
    label: 'Profile',
  },
  {
    Icon: RiKeyLine,
    path: '/profile/accounts',
    label: 'Accounts',
  },
  {
    Icon: RiComputerLine,
    path: '/profile/sessions',
    label: 'Session',
  },
];

const ProfileLayout = () => {
  const isMobile = useIsMobile(),
    activeMenu = useActiveMenuPath(Menu);

  return (
    <div className="min-h-svh bg-muted">
      <Container className="py-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/4 md:pt-4">
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

export default ProfileLayout;
