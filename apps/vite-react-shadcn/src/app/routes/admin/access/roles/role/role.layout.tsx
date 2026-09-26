import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/features/access-control';
import { useActiveMenuPath } from '@/hooks/use-active-menu-path';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiInformationFill,
  RiInformationLine,
  RiKeyFill,
  RiKeyLine,
  RiPagesFill,
  RiPagesLine,
} from '@remixicon/react';
import { Link, Outlet, useParams } from 'react-router-dom';

const Menu = [
  {
    Icon: RiInformationLine,
    IconActive: RiInformationFill,
    path: '/admin/access/roles/:id',
    label: 'Info',
  },
  {
    Icon: RiAccountCircleLine,
    IconActive: RiAccountCircleFill,
    path: '/admin/access/roles/:id/accounts',
    label: 'Accounts',
  },
  {
    Icon: RiKeyLine,
    IconActive: RiKeyFill,
    path: '/admin/access/roles/:id/permissions',
    label: 'Permissions',
  },
  {
    Icon: RiPagesLine,
    IconActive: RiPagesFill,
    path: '/admin/access/roles/:id/pages',
    label: 'Pages',
  },
];

const RoleLayout = () => {
  const params = useParams(),
    isMobile = useIsMobile(1024),
    activeMenu = useActiveMenuPath(Menu);

  const roleId = params.id!,
    role = useRole(roleId);

  return (
    <>
      <PageHeading title={`Role "${role.data?.name}"`} />

      <Container padding={'none'}>
        <div className="flex flex-col lg:flex-row">
          <div className="pt-4 lg:sticky lg:top-16 lg:h-fit lg:w-1/4">
            <Tabs
              value={activeMenu}
              orientation={isMobile ? 'horizontal' : 'vertical'}
              className="no-scrollbar overflow-x-auto border-b border-sidebar-border lg:border-r lg:border-b-0 lg:ps-4"
            >
              <TabsList variant={'line'} className="w-full justify-start">
                {Menu.map((menu) => (
                  <TabsTrigger key={menu.path} value={menu.path} asChild>
                    <Link to={menu.path.replace(':id', roleId)}>
                      {menu.path == activeMenu ? (
                        <menu.IconActive />
                      ) : (
                        <menu.Icon />
                      )}{' '}
                      {menu.label}
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
