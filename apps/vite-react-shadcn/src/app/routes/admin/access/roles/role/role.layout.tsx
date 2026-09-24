import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveMenuPath } from '@/hooks/use-active-menu-path';
import { useIsMobile } from '@/hooks/use-mobile';
import { RiAccountCircleLine, RiKeyLine, RiPagesLine } from '@remixicon/react';
import { Link, Outlet } from 'react-router-dom';

const Menu = [
  {
    Icon: RiAccountCircleLine,
    path: '/admin/access/roles/:id',
    label: 'Accounts',
  },
  {
    Icon: RiKeyLine,
    path: '/admin/access/roles/:id/permissions',
    label: 'Permissions',
  },
  {
    Icon: RiPagesLine,
    path: '/admin/access/roles/:id/pages',
    label: 'Pages',
  },
];

const RoleLayout = () => {
  const isMobile = useIsMobile(1024),
    activeMenu = useActiveMenuPath(Menu);

  return (
    <>
      <PageHeading title="Role" />

      <Container>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full overflow-hidden overflow-x-auto pt-4 lg:sticky lg:top-16 lg:h-fit lg:w-1/4">
            <Tabs
              value={activeMenu}
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
          <div className="w-full lg:w-3/4">
            <Outlet />
          </div>
        </div>
      </Container>
    </>
  );
};

export default RoleLayout;
