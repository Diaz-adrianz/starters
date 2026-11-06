import type { Locale } from '@/constants/locale.constant';
import regionStore from '@/stores/region.store';
import { format, formatDistanceToNow, isValid, parse } from 'date-fns';
import { enUS, id, type Locale as DateFnsLocale } from 'date-fns/locale';

const locales: Record<Locale, DateFnsLocale> = {
  'en-US': enUS,
  'id-ID': id,
};

const getLocale = (): DateFnsLocale => {
  const { locale } = regionStore.getState();
  return locales[locale] ?? enUS;
};

export const formatDate = (
  value: Date | string | number | null | undefined,
  pattern: string
): string => {
  if (value == null || value === '') return '';
  const date = new Date(value);
  if (!isValid(date)) return '';

  return format(date, pattern, {
    locale: getLocale(),
  });
};

export const formatDateToNow = (
  time: Date | string | number | null | undefined
): string => {
  if (time == null || time === '') return '';

  const date = new Date(time);
  if (!isValid(date)) return '';

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: getLocale(),
  });
};

export const isValidDateString = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = parse(value, 'yyyy-MM-dd', new Date());

  return isValid(date) && format(date, 'yyyy-MM-dd') === value;
};
