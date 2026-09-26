import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { TabsLinkLayout } from '@/components/shared/tabs-layout';
import { useRole } from '@/features/access-control';
import { useMenu } from '@/hooks/use-menu';
import type { Menu } from '@/types/menu.type';
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
import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';

const Menu: Menu[] = [
  {
    path: '/admin/access/roles/:id',
    label: 'Info',
    Icon: RiInformationLine,
    IconActive: RiInformationFill,
  },
  {
    path: '/admin/access/roles/:id/accounts',
    label: 'Accounts',
    Icon: RiAccountCircleLine,
    IconActive: RiAccountCircleFill,
  },
  {
    path: '/admin/access/roles/:id/permissions',
    label: 'Permissions',
    Icon: RiKeyLine,
    IconActive: RiKeyFill,
  },
  {
    path: '/admin/access/roles/:id/pages',
    label: 'Pages',
    Icon: RiPagesLine,
    IconActive: RiPagesFill,
  },
];

const RoleLayout = () => {
  const params = useParams();

  const roleId = params.id!,
    role = useRole(roleId);

  const menus = useMemo(
      () => Menu.map((m) => ({ ...m, path: m.path.replace(':id', roleId) })),
      [roleId]
    ),
    { activeMenu } = useMenu(menus);

  return (
    <>
      <PageHeading title={`Role "${role.data?.name}"`} />

      <Container padding={'none'}>
        <TabsLinkLayout
          menus={menus}
          activePath={activeMenu?.path}
          breakpoint="lg"
        >
          <Outlet />
        </TabsLinkLayout>
      </Container>
    </>
  );
};

export default RoleLayout;
