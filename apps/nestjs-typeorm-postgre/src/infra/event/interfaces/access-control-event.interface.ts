export const AccessControlEventName = {
  ACCESSCONTROL_ROLE_UPDATED: 'accessControl.role.updated',
  ACCESSCONTROL_ROLE_DELETED: 'accessControl.role.deleted',
  ACCESSCONTROL_PERMISSION_UPDATED: 'accessControl.permission.updated',
} as const;

export interface AccessControlEventPayload {
  [AccessControlEventName.ACCESSCONTROL_ROLE_UPDATED]: {
    roles: { id: string }[];
  };
  [AccessControlEventName.ACCESSCONTROL_ROLE_DELETED]: {
    roles: { id: string }[];
  };
  [AccessControlEventName.ACCESSCONTROL_PERMISSION_UPDATED]: {
    permissions: { id: string }[];
  };
}
