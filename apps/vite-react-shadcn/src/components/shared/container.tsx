import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

const containerVariants = cva('flex flex-col gap-4 px-4 md:px-6 lg:px-8', {
  variants: {
    width: {
      contained: 'container mx-auto',
      full: '',
    },
  },
  defaultVariants: {
    width: 'contained',
  },
});

interface ContainerProps
  extends ComponentProps<'div'>, VariantProps<typeof containerVariants> {
  as?: 'div' | 'header' | 'section' | 'article' | 'main' | 'footer' | 'nav';
}

const Container = ({
  children,
  className,
  width,
  as: Component = 'div',
  ...props
}: ContainerProps) => {
  return (
    <Component className={cn('flex flex-col', className)} {...props}>
      <div className={containerVariants({ width })}>{children}</div>
    </Component>
  );
};

export { Container, containerVariants };
