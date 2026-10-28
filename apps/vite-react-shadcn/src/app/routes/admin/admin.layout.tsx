import {
  Header,
  HeaderLogo,
  HeaderPortals,
  HeaderUser,
} from '@/components/shared/header';
import { MenuItemLink } from '@/components/shared/menu-item';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { HeaderNotifications } from '@/features/notification';
import { useMenu } from '@/hooks/use-menu';
import type { Menu } from '@/types/menu.type';
import { useAbility } from '@casl/react';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiDashboardFill,
  RiDashboardLine,
  RiHistoryFill,
  RiHistoryLine,
  RiKeyFill,
  RiKeyLine,
  RiShieldFill,
  RiShieldLine,
} from '@remixicon/react';
import { Link, Outlet } from 'react-router-dom';

const MenuGroup: {
  group: string;
  menus: Menu[];
}[] = [
  {
    group: 'Identity',
    menus: [
      {
        path: '/admin/identity/accounts',
        label: 'Accounts',
        Icon: RiAccountCircleLine,
        IconActive: RiAccountCircleFill,
        ability: { action: 'read', subject: 'identity:user' },
      },
    ],
  },
  {
    group: 'Access',
    menus: [
      {
        path: '/admin/access/roles',
        label: 'Roles',
        Icon: RiShieldLine,
        IconActive: RiShieldFill,
        ability: { action: 'read', subject: 'access-control:role' },
      },
      {
        path: '/admin/access/permissions',
        label: 'Permissions',
        Icon: RiKeyLine,
        IconActive: RiKeyFill,
        ability: { action: 'read', subject: 'access-control:permission' },
      },
    ],
  },
  {
    group: 'Audit',
    menus: [
      {
        path: '/admin/audit/activities',
        label: 'Activities',
        Icon: RiHistoryLine,
        IconActive: RiHistoryFill,
        ability: { action: 'read', subject: 'audit:activity' },
      },
    ],
  },
];

const AdminLayout = () => {
  const ability = useAbility();
  const { activeMenu } = useMenu(MenuGroup.flatMap((mg) => mg.menus));

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar">
        <SidebarHeader>
          <HeaderLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={!activeMenu} asChild>
                  <Link to={'/admin'}>
                    {!activeMenu ? <RiDashboardFill /> : <RiDashboardLine />}{' '}
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {MenuGroup.map((mg) => {
            return (
              <SidebarGroup key={mg.group}>
                <SidebarGroupLabel>{mg.group}</SidebarGroupLabel>
                <SidebarMenu>
                  {mg.menus.map((menu) => {
                    if (
                      !menu.ability ||
                      ability.can(menu.ability.action, menu.ability.subject)
                    )
                      return (
                        <SidebarMenuItem key={menu.path}>
                          <SidebarMenuButton
                            isActive={activeMenu?.path === menu.path}
                            asChild
                          >
                            <MenuItemLink
                              menu={menu}
                              active={activeMenu?.path === menu.path}
                            />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header
          className="sticky -mb-(--header-h)"
          slotLeft={<SidebarTrigger />}
          slotRight={
            <>
              <HeaderNotifications />
              <HeaderPortals />
              <HeaderUser />
            </>
          }
        />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
