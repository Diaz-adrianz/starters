import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

const containerVariants = cva('container mx-auto flex', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-4',
      horizontal: 'flex-row gap-2',
    },
    padding: {
      default: 'px-4 md:px-6 lg:px-8',
      none: 'p-0',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    padding: 'default',
  },
});

interface ContainerProps
  extends ComponentProps<'div'>, VariantProps<typeof containerVariants> {
  as?: 'div' | 'header' | 'section' | 'article' | 'main' | 'footer' | 'nav';
}

const Container = ({
  children,
  className,
  orientation,
  padding,
  as: Component = 'div',
  ...props
}: ContainerProps) => {
  return (
    <Component className={cn('flex flex-col', className)} {...props}>
      <div className={containerVariants({ orientation, padding })}>
        {children}
      </div>
    </Component>
  );
};

export { Container, containerVariants };
