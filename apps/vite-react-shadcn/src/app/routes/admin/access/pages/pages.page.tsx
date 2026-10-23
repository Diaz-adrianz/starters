import { Can } from '@/components/shared/can';
import {
  Page,
  PageHeader,
  PageNav,
  PageSection,
} from '@/components/shared/page';
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
    <Page className="min-h-svh">
      <PageNav
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Access' },
          { label: 'Pages' },
        ]}
      />
      <PageHeader
        title="Pages"
        action={
          <Can I={'create'} a={'identity:page'}>
            <Button>
              <RiAddLine /> Create page
            </Button>
          </Can>
        }
      />
      <PageSection>
        <Card>
          <CardContent>
            <PageList query={query}>
              <div className="mb-8 flex flex-wrap gap-2">
                <PageListSearchBox />
              </div>
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
            </PageList>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default PagesPage;
