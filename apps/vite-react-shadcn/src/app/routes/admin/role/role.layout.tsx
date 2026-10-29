import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { TabLayout } from '@/components/shared/tab-layout';
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
} from '@remixicon/react';
import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';

const Menu: Menu[] = [
  {
    path: '/admin/iam/roles/:id',
    label: 'Info',
    Icon: RiInformationLine,
    IconActive: RiInformationFill,
  },
  {
    path: '/admin/iam/roles/:id/accounts',
    label: 'Accounts',
    Icon: RiAccountCircleLine,
    IconActive: RiAccountCircleFill,
  },
  {
    path: '/admin/iam/roles/:id/permissions',
    label: 'Permissions',
    Icon: RiKeyLine,
    IconActive: RiKeyFill,
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
    <Page className="min-h-svh">
      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'IAM' },
          { label: 'Roles', path: '/admin/iam/roles' },
          { label: role.data?.name ?? 'role' },
        ]}
      />
      <PageHeader title={`Role ${role.data?.name}`} />

      <PageSection dense>
        <TabLayout menus={menus} activeMenu={activeMenu} breakpoint="lg">
          <Outlet />
        </TabLayout>
      </PageSection>
    </Page>
  );
};

export default RoleLayout;
