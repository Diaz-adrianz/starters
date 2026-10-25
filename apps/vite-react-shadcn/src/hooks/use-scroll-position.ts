import { useEffect, useRef, useState } from 'react';

export type ScrollPos = 'start' | 'up' | 'down' | 'end';

function useScrollPosition({
  offsetTop = 0,
  offsetBottom = 0,
}: { offsetTop?: number; offsetBottom?: number } = {}) {
  const [pos, setPos] = useState<ScrollPos>('start');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setPos((prev) =>
        y < offsetTop
          ? 'start'
          : y >= max - offsetBottom
            ? 'end'
            : y < lastY.current
              ? 'up'
              : y > lastY.current
                ? 'down'
                : prev
      );
      lastY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offsetTop, offsetBottom]);

  return pos;
}

export { useScrollPosition };
