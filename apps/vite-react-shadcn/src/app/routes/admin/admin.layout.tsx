import { useAbility } from '@/app/providers';
import {
  Header,
  HeaderApps,
  HeaderLogo,
  HeaderNotifications,
  HeaderUser,
} from '@/components/shared/header';
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
import { useActiveMenuPath } from '@/hooks/use-active-menu-path';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiDashboardFill,
  RiDashboardLine,
  RiKeyFill,
  RiKeyLine,
  RiPagesFill,
  RiPagesLine,
  RiShieldFill,
  RiShieldLine,
  RiUserSmileFill,
  RiUserSmileLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import { Link, Outlet } from 'react-router-dom';

const Menu: {
  group: string;
  items: {
    Icon: RemixiconComponentType;
    IconActive: RemixiconComponentType;
    path: string;
    label: string;
    ability?: { action: string; subject: string };
  }[];
}[] = [
  {
    group: 'Identity',
    items: [
      {
        Icon: RiAccountCircleLine,
        IconActive: RiAccountCircleFill,
        path: '/admin/identity/accounts',
        label: 'Accounts',
        ability: { action: 'read', subject: 'identity:user' },
      },
      {
        Icon: RiUserSmileLine,
        IconActive: RiUserSmileFill,
        path: '/admin/identity/profiles',
        label: 'Profiles',
        ability: { action: 'read', subject: 'identity:profile' },
      },
    ],
  },
  {
    group: 'Access',
    items: [
      {
        Icon: RiShieldLine,
        IconActive: RiShieldFill,
        path: '/admin/access/roles',
        label: 'Roles',
        ability: { action: 'read', subject: 'access-control:role' },
      },
      {
        Icon: RiKeyLine,
        IconActive: RiKeyFill,
        path: '/admin/access/permissions',
        label: 'Permissions',
        ability: { action: 'read', subject: 'access-control:permission' },
      },
      {
        Icon: RiPagesLine,
        IconActive: RiPagesFill,
        path: '/admin/access/pages',
        label: 'Pages',
        ability: { action: 'read', subject: 'access-control:page' },
      },
    ],
  },
];

const AdminLayout = () => {
  const ability = useAbility();
  const activeMenu = useActiveMenuPath(Menu.flatMap((m) => m.items));

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
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

          {Menu.map((menu) => {
            return (
              <SidebarGroup key={menu.group}>
                <SidebarGroupLabel>{menu.group}</SidebarGroupLabel>
                <SidebarMenu>
                  {menu.items.map((item) => {
                    if (
                      !item.ability ||
                      ability.can(item.ability.action, item.ability.subject)
                    )
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            isActive={activeMenu === item.path}
                            asChild
                          >
                            <Link to={item.path}>
                              {activeMenu === item.path ? (
                                <item.IconActive />
                              ) : (
                                <item.Icon />
                              )}{' '}
                              {item.label}
                            </Link>
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
      <SidebarInset className="bg-muted">
        <Header
          className="bg-sidebar"
          slotLeft={<SidebarTrigger />}
          slotRight={
            <>
              <HeaderNotifications />
              <HeaderApps />
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
