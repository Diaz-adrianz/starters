import { Link, type LinkProps } from 'react-router-dom';
import { cn } from 'cn';

function InlineLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'underline underline-offset-4 hover:opacity-60 focus-visible:opacity-60',
        className
      )}
      {...props}
    />
  );
}

export { InlineLink };
