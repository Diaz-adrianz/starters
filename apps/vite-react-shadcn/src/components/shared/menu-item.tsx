import type { Menu } from '@/types/menu.type';
import { type ComponentProps } from 'react';
import { Link } from 'react-router-dom';

function MenuItemContent({ menu, active }: { menu: Menu; active?: boolean }) {
  const Icon = active ? (menu.IconActive ?? menu.Icon) : menu.Icon;

  return (
    <>
      {Icon && <Icon />} {menu.label}
    </>
  );
}

function MenuItemLink({
  menu,
  active,
  ...props
}: Omit<ComponentProps<typeof Link>, 'to'> & {
  menu: Menu;
  active?: boolean;
}) {
  return (
    <Link to={menu.path} {...props}>
      <MenuItemContent menu={menu} active={active} />
    </Link>
  );
}

export { MenuItemContent, MenuItemLink };
