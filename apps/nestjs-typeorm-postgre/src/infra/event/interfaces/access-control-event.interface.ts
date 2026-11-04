export const AccessControlEventName = {
  ROLE_UPDATED: 'accessControl.role.updated',
  ROLE_DELETED: 'accessControl.role.deleted',
  PERMISSION_UPDATED: 'accessControl.permission.updated',
  ROLE_USER_CREATED: 'accessControl.roleUser.created',
  ROLE_USER_DELETED: 'accessControl.roleUser.deleted',
  ROLE_PERMISSION_CREATED: 'accessControl.rolePermission.created',
  ROLE_PERMISSION_DELETED: 'accessControl.rolePermission.deleted',
} as const;

export interface AccessControlEventPayload {
  [AccessControlEventName.ROLE_UPDATED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.ROLE_DELETED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.PERMISSION_UPDATED]: {
    target: { id: string }[];
  };
  [AccessControlEventName.ROLE_USER_CREATED]: {
    id: string;
    roleId: string;
    userId: string;
  };
  [AccessControlEventName.ROLE_USER_DELETED]: {
    id: string;
    roleId: string;
    userId: string;
  }[];
  [AccessControlEventName.ROLE_PERMISSION_CREATED]: {
    id: string;
    roleId: string;
    permissionId: string;
  };
  [AccessControlEventName.ROLE_PERMISSION_DELETED]: {
    id: string;
    roleId: string;
    permissionId: string;
  }[];
}
