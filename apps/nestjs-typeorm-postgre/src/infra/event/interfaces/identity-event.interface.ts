export const IdentityEventName = {
  USER_CREATED: 'identity.user.created',
  USER_UPDATED: 'identity.user.updated',
  USER_DELETED: 'identity.user.deleted',
  USER_INVITED: 'identity.user.invited',
} as const;

export interface IdentityEventPayload {
  [IdentityEventName.USER_CREATED]: {
    target: { id: string };
    payload: { id: string; username: string; roles?: { name: string }[] };
  };
  [IdentityEventName.USER_UPDATED]: {
    target: { id: string }[];
    payload?: { username?: string };
  };
  [IdentityEventName.USER_DELETED]: {
    target: { id: string }[];
  };
  [IdentityEventName.USER_INVITED]: {
    id: string;
    username: string;
    email: string;
    otp: { code: string; expiresIn: string };
  };
}
