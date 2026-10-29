import { cn } from 'cn';
import { Fragment, type ComponentProps, type ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Link } from 'react-router-dom';

function Page({ className, ...props }: ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'flex flex-col items-center bg-muted pt-[calc(var(--header-h)+(--spacing(4)))]',
        className
      )}
      {...props}
    />
  );
}

function PageNav({
  items,
  className,
  ...props
}: Omit<ComponentProps<typeof Breadcrumb>, 'children'> & {
  items: { path?: string; label: string }[];
}) {
  return (
    <Breadcrumb
      className={cn('container px-4 md:px-6 lg:px-8', 'mb-4', className)}
      {...props}
    >
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function PageHeader({
  title,
  description,
  action,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'container px-4 md:px-6 lg:px-8',
        'mb-8 flex flex-wrap items-start justify-between',
        className
      )}
      {...props}
    >
      <div>
        <h1 className="typo-heading-xl">{title}</h1>
        {!!description && (
          <p className="typo-body-md text-muted-foreground">{description}</p>
        )}
      </div>
      {!!action && (
        <div className="flex flex-wrap items-center gap-2">{action}</div>
      )}
    </div>
  );
}

function PageSection({
  horizontal,
  dense,
  className,
  ...props
}: ComponentProps<'section'> & { horizontal?: boolean; dense?: boolean }) {
  return (
    <section
      className={cn(
        'container',
        dense ? '' : 'px-4 md:px-6 lg:px-8',
        'mb-4 flex',
        horizontal ? 'flex-row gap-2' : 'flex-col gap-4',
        className
      )}
      {...props}
    />
  );
}

export { Page, PageNav, PageHeader, PageSection };
