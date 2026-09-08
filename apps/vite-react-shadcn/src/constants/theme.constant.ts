import type { Option } from '@/utils/option';

export type Theme = 'dark' | 'light' | 'system';

export const ThemeOptions: Option<Theme>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;
