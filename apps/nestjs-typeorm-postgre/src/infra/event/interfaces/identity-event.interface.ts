export const IdentityEventName = {
  USER_CREATED: 'identity.user.created',
  USER_UPDATED: 'identity.user.updated',
  USER_ARCHIVED: 'identity.user.archived',
  USER_RESTORED: 'identity.user.restored',
  USER_DELETED: 'identity.user.deleted',
  USER_INVITED: 'identity.user.invited',
  USER_FORGOTPASSWORD: 'identity.user.forgotPassword',
  USER_PASSWORDUPDATED: 'identity.user.passwordUpdated',
} as const;

export interface IdentityEventPayload {
  [IdentityEventName.USER_CREATED]: {
    id: string;
    username: string;
    roles: { name: string }[];
  };
  [IdentityEventName.USER_UPDATED]: {
    id: string;
    username: string;
    password: boolean;
  };
  [IdentityEventName.USER_ARCHIVED]: {
    id: string;
  };
  [IdentityEventName.USER_RESTORED]: {
    id: string;
  };
  [IdentityEventName.USER_DELETED]: {
    id: string;
  };
  [IdentityEventName.USER_INVITED]: {
    id: string;
    username: string;
    email: string;
    otp: { code: string; expiresIn: string };
  };
  [IdentityEventName.USER_FORGOTPASSWORD]: {
    id: string;
    username: string;
    email: string;
    otp: { code: string; expiresIn: string };
  };
}
