import type { Option } from '@/utils/option';
import type {
  SessionClientDevice,
  SessionClientType,
} from '../types/session.type';
import {
  RiAndroidLine,
  RiAppleLine,
  RiComputerLine,
  RiMacbookLine,
  RiSmartphoneLine,
  RiTabletLine,
  type RemixiconComponentType,
} from '@remixicon/react';

export const SessionClientTypeMap: Record<
  SessionClientType,
  Option<SessionClientType, { Icon: RemixiconComponentType }>
> = {
  web: {
    value: 'web',
    label: 'Web',
    meta: { Icon: RiMacbookLine },
  },
  ios: {
    value: 'ios',
    label: 'IOS',
    meta: { Icon: RiAppleLine },
  },
  android: {
    value: 'android',
    label: 'Android',
    meta: { Icon: RiAndroidLine },
  },
} as const;

export const SessionClientTypeOptions = Object.values(SessionClientTypeMap);

export const SessionClientDeviceMap: Record<
  SessionClientDevice,
  Option<SessionClientDevice, { Icon: RemixiconComponentType }>
> = {
  desktop: {
    value: 'desktop',
    label: 'Desktop',
    meta: { Icon: RiComputerLine },
  },
  tablet: {
    value: 'tablet',
    label: 'IOS',
    meta: { Icon: RiTabletLine },
  },
  mobile: {
    value: 'mobile',
    label: 'Android',
    meta: { Icon: RiSmartphoneLine },
  },
} as const;

export const SessionClientDeviceOptions = Object.values(SessionClientDeviceMap);
