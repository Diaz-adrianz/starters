import { format, isValid } from 'date-fns';
import { enUS, type Locale } from 'date-fns/locale';

const locales: Record<string, Locale> = { en: enUS };

export const formatDate = (
  value: Date | string | number | null | undefined,
  fmt: string,
  { fallBack = '', locale = 'en' }: { fallBack?: string; locale?: string } = {}
): string => {
  if (!value) return fallBack;
  const date = new Date(value);
  if (!isValid(date)) return fallBack;
  return format(date, fmt, { locale: locales[locale] ?? locales.en });
};
