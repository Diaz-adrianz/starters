import { useIsMobile } from '@/hooks/use-mobile';
import type { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import type { Menu } from '@/types/menu.type';
import { cn } from 'cn';
import { MenuItemContent, MenuItemLink } from './menu-item';

type Breakpoint = 'md' | 'lg';

const BREAKPOINT_PX: Record<Breakpoint, number> = {
  md: 768,
  lg: 1024,
};

const BREAKPOINT_CLASSES: Record<
  Breakpoint,
  {
    root: string;
    side: string;
    tabs: string;
    content: string;
  }
> = {
  md: {
    root: 'md:flex-row',
    side: 'md:sticky md:top-16 md:h-fit md:w-1/4',
    tabs: 'md:border-r md:border-b-0 md:ps-4',
    content: 'md:w-3/4',
  },
  lg: {
    root: 'lg:flex-row',
    side: 'lg:sticky lg:top-16 lg:h-fit lg:w-1/4',
    tabs: 'lg:border-r lg:border-b-0 lg:ps-4',
    content: 'lg:w-3/4',
  },
};

export const TabsLinkLayout = ({
  children,
  menus,
  activePath,
  breakpoint = 'md',
}: {
  children: ReactNode;
  menus: Menu[];
  activePath?: Menu['path'];
  breakpoint?: Breakpoint;
}) => {
  const isMobile = useIsMobile(BREAKPOINT_PX[breakpoint]);
  const cls = BREAKPOINT_CLASSES[breakpoint];

  return (
    <div className={cn('flex flex-col', cls.root)}>
      <div className={cn('overflow-x-auto pt-4', cls.side)}>
        <Tabs
          value={activePath}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          className={cn(
            'no-scrollbar overflow-x-auto border-b border-sidebar-border',
            cls.tabs
          )}
        >
          <TabsList variant={'line'} className="w-full justify-start">
            {menus.map((menu) => (
              <TabsTrigger key={menu.path} value={menu.path} asChild>
                <MenuItemLink menu={menu} active={menu.path == activePath} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className={cn('w-full', cls.content)}>{children}</div>
    </div>
  );
};

export const TabsStaticLayout = ({
  children,
  menus,
  path,
  onPathChange,
  breakpoint = 'md',
}: {
  children: ReactNode;
  menus: Menu[];
  path: Menu['path'];
  onPathChange: (path: Menu['path']) => void;
  breakpoint?: Breakpoint;
}) => {
  const isMobile = useIsMobile(BREAKPOINT_PX[breakpoint]);
  const cls = BREAKPOINT_CLASSES[breakpoint];

  return (
    <div className={cn('flex flex-col', cls.root)}>
      <div className={cn('overflow-x-auto pt-4', cls.side)}>
        <Tabs
          value={path}
          onValueChange={onPathChange}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          className={cn(
            'no-scrollbar overflow-x-auto border-b border-sidebar-border',
            cls.tabs
          )}
        >
          <TabsList variant={'line'} className="w-full justify-start">
            {menus.map((menu) => (
              <TabsTrigger key={menu.path} value={menu.path}>
                <MenuItemContent menu={menu} active={menu.path == path} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className={cn('w-full', cls.content)}>{children}</div>
    </div>
  );
};
