import { useLocation, matchPath } from 'react-router-dom';

export const useActiveMenuPath = (
  menu: { path: string }[]
): string | undefined => {
  const { pathname } = useLocation();

  return menu
    .filter((m) => matchPath({ path: m.path, end: false }, pathname))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;
};
