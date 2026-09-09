import { cn } from 'cn';
import type React from 'react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export const HeaderShell = ({
  slotLeft,
  slotRight,
  className,
  ...props
}: {
  slotLeft?: ReactNode;
  slotRight?: ReactNode;
} & React.ComponentProps<'header'>) => {
  const [scrollPos, setScrollPos] = useState<'start' | 'up' | 'down' | 'end'>(
    'start'
  );
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (currentScrollY < 50) setScrollPos('start');
      else if (currentScrollY >= maxScroll - 50) setScrollPos('end');
      else if (currentScrollY < lastScrollY.current) setScrollPos('up');
      else if (currentScrollY > lastScrollY.current) setScrollPos('down');

      lastScrollY.current = currentScrollY;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 left-0 z-50 flex h-16 w-full border-b-2 border-foreground/10 bg-background shadow-md transition-transform duration-300',
        className,
        scrollPos === 'start' && 'translate-y-0 shadow-none',
        scrollPos === 'up' && 'translate-y-0',
        scrollPos === 'down' && '-translate-y-full',
        scrollPos === 'end' && 'translate-y-0'
      )}
      {...props}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">{slotLeft}</div>
        <div className="flex items-center gap-4">{slotRight}</div>
      </div>
    </header>
  );
};
