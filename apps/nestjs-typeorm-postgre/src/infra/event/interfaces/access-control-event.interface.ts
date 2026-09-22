export const AccessControlEventName = {
  ROLE_UPDATED: 'accessControl.role.updated',
  ROLE_DELETED: 'accessControl.role.deleted',
  ROLE_USER_SET: 'accessControl.role.user_set',
  ROLE_PERMISSION_SET: 'accessControl.role.permission_set',
  ROLE_PAGE_SET: 'accessControl.role.page_set',
  PERMISSION_UPDATED: 'accessControl.permission.updated',
  PAGE_UPDATED: 'accessControl.page.updated',
  PAGE_DELETED: 'accessControl.page.deleted',
} as const;

export interface AccessControlEventPayload {
  [AccessControlEventName.ROLE_UPDATED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.ROLE_DELETED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.ROLE_USER_SET]: {
    target: { id: string }[];
    payload: { userId: string };
  };
  [AccessControlEventName.ROLE_PERMISSION_SET]: {
    target: { id: string }[];
    payload: { permissionId: string };
  };
  [AccessControlEventName.ROLE_PAGE_SET]: {
    target: { id: string }[];
    payload: { pageId: string };
  };
  [AccessControlEventName.PERMISSION_UPDATED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.PAGE_UPDATED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.PAGE_DELETED]: {
    target: { id: string }[];
    affected: { roles: { id: string }[] };
  };
}
