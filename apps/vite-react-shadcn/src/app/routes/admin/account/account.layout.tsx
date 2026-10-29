import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
import { TabLayout } from '@/components/shared/tab-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/features/identity';
import { useMenu } from '@/hooks/use-menu';
import type { Menu } from '@/types/menu.type';
import { getInitials } from '@/utils/string';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiComputerFill,
  RiComputerLine,
  RiHistoryFill,
  RiHistoryLine,
  RiInformationFill,
  RiInformationLine,
} from '@remixicon/react';
import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';

const Menu: Menu[] = [
  {
    path: '/admin/iam/accounts/:id',
    label: 'Info',
    Icon: RiInformationLine,
    IconActive: RiInformationFill,
  },
  {
    path: '/admin/iam/accounts/:id/profile',
    label: 'Profile',
    Icon: RiAccountCircleLine,
    IconActive: RiAccountCircleFill,
  },
  {
    path: '/admin/iam/accounts/:id/sessions',
    label: 'Sessions',
    Icon: RiComputerLine,
    IconActive: RiComputerFill,
  },
  {
    path: '/admin/iam/accounts/:id/activities',
    label: 'Activities',
    Icon: RiHistoryLine,
    IconActive: RiHistoryFill,
  },
];

const AccountLayout = () => {
  const params = useParams();

  const id = params.id!,
    { data } = useUser(id);

  const menus = useMemo(
      () => Menu.map((m) => ({ ...m, path: m.path.replace(':id', id) })),
      [id]
    ),
    { activeMenu } = useMenu(menus);

  return (
    <Page className="min-h-svh">
      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'IAM' },
          { label: 'Accounts', path: '/admin/iam/accounts' },
          { label: data?.username ?? 'account' },
        ]}
      />
      <PageHeader
        title={data?.username ?? ''}
        action={
          data && (
            <Avatar className="size-20">
              <AvatarImage src={data.avatar ?? ''} alt="" />
              <AvatarFallback>{getInitials(data.username)}</AvatarFallback>
            </Avatar>
          )
        }
      />

      <PageSection dense>
        <TabLayout menus={menus} activeMenu={activeMenu} breakpoint="lg">
          <Outlet />
        </TabLayout>
      </PageSection>
    </Page>
  );
};

export default AccountLayout;
