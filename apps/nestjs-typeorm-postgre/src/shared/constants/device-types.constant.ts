export const DeviceTypes = ['web', 'ios', 'android'] as const;

export type DeviceType = (typeof DeviceTypes)[number];
