import type { Option } from '@/utils/option';

export type Language = 'en' | 'id';

export const LanguageMap: Record<Language, Option<Language>> = {
  en: {
    value: 'en',
    label: 'English',
  },
  id: {
    value: 'id',
    label: 'Bahasa Indonesia',
  },
} as const;

export const LanguageOptions = Object.values(LanguageMap);
