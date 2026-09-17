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
      <PageHeading title="Pages" />

      <PageList query={query}>
        <Container className="mb-4" orientation={'horizontal'}>
          <PageListSearchBox />
          <Button>
            <RiAddLine /> Create page
          </Button>
        </Container>

        <Container className="mb-4">
          <Card>
            <CardContent>
              <PageListItemGroup
                separator
                skeleton={<PageItemSkeleton className="p-0" />}
                className="mb-8"
              >
                {(page) => (
                  <PageItem
                    key={page.id}
                    page={page}
                    className="p-0"
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
