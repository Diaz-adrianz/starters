export const IdentityEventName = {
  IDENTITY_USER_UPDATED: 'identity.user.updated',
  IDENTITY_USER_DELETED: 'identity.user.deleted',
} as const;

export interface IdentityEventPayload {
  [IdentityEventName.IDENTITY_USER_UPDATED]: {
    users: { id: string }[];
  };
  [IdentityEventName.IDENTITY_USER_DELETED]: {
    users: { id: string }[];
  };
}
