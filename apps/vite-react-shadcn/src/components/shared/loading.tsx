import { RiLoader2Line } from '@remixicon/react';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

function LoadingOverlay({
  text = 'Loading',
  className,
  ...props
}: ComponentProps<'div'> & {
  text?: string;
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center gap-2 bg-background/20 p-4 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <RiLoader2Line className="animate-spin" />
      <span>{text}</span>
    </div>
  );
}

export { LoadingOverlay };
