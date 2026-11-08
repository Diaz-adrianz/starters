export const ClientTypes = ['web', 'ios', 'android'] as const;

export type ClientType = (typeof ClientTypes)[number];

export const ClientDevices = ['desktop', 'tablet', 'mobile'] as const;

export type ClientDevice = (typeof ClientDevices)[number];
