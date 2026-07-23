export const MediaMimeTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
] as const;

export type MediaMimeType = (typeof MediaMimeTypes)[number];

export const MediaExtensions: Record<MediaMimeType, string> = {
  'image/png': '.png',
  'image/jpg': '.jpg',
  'image/jpeg': '.jpeg',
  'application/pdf': '.pdf',
};
