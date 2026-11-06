export const GatewayEvents = {
  MESSAGE_CREATED: 'message.created',
} as const;

export type GatewayEvent = (typeof GatewayEvents)[keyof typeof GatewayEvents];

export interface GatewayEventPayload {
  [GatewayEvents.MESSAGE_CREATED]: {
    id: string;
    title: string;
    body: string;
  };
}
