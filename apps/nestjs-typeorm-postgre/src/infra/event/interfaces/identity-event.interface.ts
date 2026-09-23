export const IdentityEventName = {
  USER_CREATED: 'identity.user.created',
  USER_UPDATED: 'identity.user.updated',
  USER_DELETED: 'identity.user.deleted',
} as const;

export interface IdentityEventPayload {
  [IdentityEventName.USER_CREATED]: {
    target: { id: string };
    payload: { id: string; username: string; roleName?: string };
  };
  [IdentityEventName.USER_UPDATED]: {
    target: { id: string }[];
    payload?: { username?: string };
  };
  [IdentityEventName.USER_DELETED]: {
    target: { id: string }[];
  };
}
