import { Can } from '@/components/shared/can';
import { Container } from '@/components/shared/container';
import { PageHeading } from '@/components/shared/page-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  PageItem,
  PageItemActionMenu,
  PageItemSkeleton,
  PageList,
  PageListItemGroup,
  PageListPagination,
  PageListSearchBox,
} from '@/features/access-control';
import { useResourceQuery } from '@/hooks/use-resource-query';
import { RiAddLine } from '@remixicon/react';

const PagesPage = () => {
  const query = useResourceQuery({
    page: 1,
    limit: 10,
    order: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHeading
        breadcrumb={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Access' },
          { label: 'Pages' },
        ]}
        title="Pages"
      />

      <PageList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <PageListSearchBox />
          <Can I={'create'} a={'identity:page'}>
            <Button>
              <RiAddLine /> Create page
            </Button>
          </Can>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <PageListItemGroup
                separator
                skeleton={<PageItemSkeleton />}
                className="mb-8"
              >
                {(page) => (
                  <PageItem
                    key={page.id}
                    page={page}
                    slotActions={<PageItemActionMenu page={page} />}
                  />
                )}
              </PageListItemGroup>
              <PageListPagination />
            </CardContent>
          </Card>
        </Container>
      </PageList>
    </>
  );
};

export default PagesPage;
