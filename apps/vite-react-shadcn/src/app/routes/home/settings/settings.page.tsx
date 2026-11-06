import { useTheme } from '@/app/providers/theme.provider';
import { Page, PageHeader, PageSection } from '@/components/shared/page';
import { Card, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LanguageOptions, type Language } from '@/constants/language.constant';
import { LocaleOptions, type Locale } from '@/constants/locale.constant';
import { ThemeOptions, type Theme } from '@/constants/theme.constant';
import regionStore from '@/stores/region.store';
import { RiContrastLine, RiGlobalLine, RiTranslate2 } from '@remixicon/react';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, language, setLanguage } = regionStore();

  return (
    <Page className="not-md:pt-8">
      <PageHeader title="General Settings" />

      <PageSection>
        <Card>
          <CardContent>
            <ItemGroup>
              <Item size={'xs'}>
                <ItemMedia variant="icon">
                  <RiContrastLine className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Theme</ItemTitle>
                  <ItemDescription>
                    Choose your preferred display theme
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Select
                    value={theme}
                    onValueChange={(v) => setTheme(v as Theme)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ThemeOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection>
        <Card>
          <CardContent>
            <ItemGroup>
              <Item size={'xs'}>
                <ItemMedia variant="icon">
                  <RiGlobalLine className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Regional Format</ItemTitle>
                  <ItemDescription>
                    Customize how dates, times, numbers, and currencies are
                    displayed.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Select
                    value={locale}
                    onValueChange={(v) => setLocale(v as Locale)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LocaleOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
              <ItemSeparator />
              <Item size={'xs'}>
                <ItemMedia variant="icon">
                  <RiTranslate2 className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Language</ItemTitle>
                  <ItemDescription>
                    Choose the language used throughout the application.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Select
                    value={language}
                    onValueChange={(v) => setLanguage(v as Language)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LanguageOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </PageSection>
    </Page>
  );
};

export default SettingsPage;
