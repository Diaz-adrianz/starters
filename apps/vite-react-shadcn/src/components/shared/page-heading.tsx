import type { ComponentProps, ReactNode } from 'react';
import { cn } from 'cn';

export const PageHeading = ({
  title,
  description,
  slotRight,
  className,
  ...props
}: ComponentProps<'div'> & {
  title: ReactNode;
  description?: ReactNode;
  slotRight?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'container mx-auto flex items-center justify-between gap-4 px-4 py-8 md:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {slotRight && <div className="flex items-center gap-2">{slotRight}</div>}
    </div>
  );
};
