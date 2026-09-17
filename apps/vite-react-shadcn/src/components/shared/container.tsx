import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

const containerVariants = cva('flex px-4 md:px-6 lg:px-8', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-4',
      horizontal: 'flex-row gap-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
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
  as: Component = 'div',
  ...props
}: ContainerProps) => {
  return (
    <Component className={cn('flex flex-col', className)} {...props}>
      <div className={containerVariants({ orientation })}>{children}</div>
    </Component>
  );
};

export { Container, containerVariants };
