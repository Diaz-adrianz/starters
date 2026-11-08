export const DeviceTypes = ['desktop', 'tablet', 'mobile'] as const;

export type DeviceType = (typeof DeviceTypes)[number];

export const ClientTypes = ['web', 'ios', 'android'] as const;

export type ClientType = (typeof ClientTypes)[number];
