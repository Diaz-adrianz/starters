import { Fragment, type ComponentProps, type ReactNode } from 'react';
import { cn } from 'cn';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';

export const PageHeading = ({
  title,
  description,
  slotRight,
  breadcrumb,
  className,
  ...props
}: ComponentProps<'div'> & {
  title: ReactNode;
  description?: ReactNode;
  slotRight?: ReactNode;
  breadcrumb?: { label: string; path?: string }[];
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
        {breadcrumb && (
          <Breadcrumb className="mb-1">
            <BreadcrumbList>
              {breadcrumb.map((crumb, i) => (
                <Fragment key={i}>
                  <BreadcrumbItem>
                    {crumb.path ? (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.path}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {slotRight && <div className="flex items-center gap-2">{slotRight}</div>}
    </div>
  );
};
