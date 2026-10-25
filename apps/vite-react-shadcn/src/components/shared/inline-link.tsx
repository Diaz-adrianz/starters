import { Link, type LinkProps } from 'react-router-dom';
import { cn } from 'cn';

function InlineLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'underline-offset-4 hover:underline focus-visible:underline',
        className
      )}
      {...props}
    />
  );
}

export { InlineLink };
