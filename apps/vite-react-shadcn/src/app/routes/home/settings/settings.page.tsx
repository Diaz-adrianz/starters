import { Container } from '@/components/layout/container';
import { PageHeading } from '@/components/shared/page-heading';
import { ThemeSelect } from '@/components/shared/theme-select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';

const SettingsPage = () => {
  return (
    <>
      <PageHeading title="General Settings" />

      <Container>
        <Card>
          <CardContent>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemTitle>Theme</ItemTitle>
                  <ItemDescription>
                    Choose your preferred display theme
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ThemeSelect />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default SettingsPage;
