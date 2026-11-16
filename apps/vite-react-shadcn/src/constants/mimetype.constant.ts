import type { Option } from '@/utils/option';

export type MimeType =
  'image/png' | 'image/jpg' | 'image/jpeg' | 'application/pdf';

export const MimeTypeOptions: Option<MimeType>[] = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpg', label: 'JPG' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'application/pdf', label: 'PDF' },
] as const;
