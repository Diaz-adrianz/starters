import type { RemixiconComponentType } from '@remixicon/react';

export type Menu = {
  path: string;
  label: string;
  Icon?: RemixiconComponentType;
  IconActive?: RemixiconComponentType;
  ability?: { action: string; subject: string };
};
