import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Link } from 'react-router-dom';
import { RiFileUnknowLine, RiTreasureMapLine } from '@remixicon/react';
import type { ComponentProps } from 'react';

function NotFoundPageEmpty({ ...props }: ComponentProps<typeof Empty>) {
  return (
    <Empty {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiTreasureMapLine />
        </EmptyMedia>
        <EmptyTitle>Page not found</EmptyTitle>
        <EmptyDescription>
          The page you are trying to access does not exist or has been moved.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to={'/'}>Back to homepage</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function NotFoundResourceEmpty({
  resource = 'Resource',
  ...props
}: ComponentProps<typeof Empty> & {
  resource?: string;
}) {
  return (
    <Empty {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiFileUnknowLine />
        </EmptyMedia>
        <EmptyTitle>{resource} Not found</EmptyTitle>
        <EmptyDescription>
          This item may have been deleted or moved.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { NotFoundPageEmpty, NotFoundResourceEmpty };
