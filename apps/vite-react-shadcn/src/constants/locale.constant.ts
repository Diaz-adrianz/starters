import type { Option } from '@/utils/option';
import type { Language } from './language.constant';

export type Locale = 'en-US' | 'id-ID';

export const LocaleMap: Record<
  Locale,
  Option<Locale, { language: Language }>
> = {
  'en-US': {
    value: 'en-US',
    label: 'English (USA)',
    meta: { language: 'en' },
  },
  'id-ID': {
    value: 'id-ID',
    label: 'Bahasa Indonesia',
    meta: { language: 'id' },
  },
} as const;

export const LocaleOptions = Object.values(LocaleMap);
