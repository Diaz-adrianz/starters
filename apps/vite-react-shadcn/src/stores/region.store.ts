import type { Language } from '@/constants/language.constant';
import { LocaleMap, type Locale } from '@/constants/locale.constant';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RegionState = {
  language: Language;
  locale: Locale;
  timeZone: string;
};

type RegionAction = {
  setLanguage: (language: Language) => void;
  setLocale: (locale: Locale) => void;
  setTimeZone: (timeZone: string) => void;
};

const detectState = (): RegionState => {
  const browserLocales = navigator.languages ?? [navigator.language];

  const matchedLocale = browserLocales
    .map((locale) => Intl.getCanonicalLocales(locale)[0])
    .find((locale) => locale in LocaleMap);

  const locale = (matchedLocale ?? 'en-US') as Locale;

  return {
    language: LocaleMap[locale].meta!.language,
    locale: LocaleMap[locale].value,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

const regionStore = create<RegionState & RegionAction>()(
  persist(
    (set) => ({
      ...detectState(),
      setLanguage(language) {
        set({ language });
      },
      setLocale(locale) {
        set({ locale });
      },
      setTimeZone(timeZone) {
        set({ timeZone });
      },
    }),
    {
      name: 'region-storage',
      partialize: (state) => ({
        language: state.language,
        locale: state.locale,
        timeZone: state.timeZone,
      }),
    }
  )
);

export default regionStore;
