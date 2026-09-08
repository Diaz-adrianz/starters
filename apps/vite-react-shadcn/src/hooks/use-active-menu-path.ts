import { useLocation } from 'react-router-dom';

export const useActiveMenuPath = (
  menu: { path: string }[]
): string | undefined => {
  const { pathname } = useLocation();

  return menu
    .filter((m) => pathname === m.path || pathname.startsWith(`${m.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;
};
