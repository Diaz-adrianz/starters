import { useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import type { Menu } from '../types/menu.type';

export const useMenu = (menus: Menu[]) => {
  const { pathname } = useLocation();

  const activeMenu = useMemo(
    () =>
      menus
        .filter((m) => matchPath({ path: m.path, end: false }, pathname))
        .sort((a, b) => b.path.length - a.path.length)
        .at(0),
    [menus, pathname]
  );

  return { menus, activeMenu };
};
