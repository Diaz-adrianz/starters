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
import { RiTreasureMapLine } from '@remixicon/react';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-svh items-center justify-center p-16">
      <Empty>
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
    </div>
  );
};

export default NotFoundPage;
