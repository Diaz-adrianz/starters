import { ResourceScopeIntf } from '../../../shared/interfaces/resource-scope.interface';
import { RolesData } from './roles.data';

export const PermissionsData: {
  group: string;
  entries: {
    description: string;
    permission: string;
    roles: { name: string; scope?: ResourceScopeIntf }[];
  }[];
}[] = [
  {
    group: 'Access control',
    entries: [
      // permissions
      {
        description: 'Create permission',
        permission: 'permissions:create',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Read permission',
        permission: 'permissions:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update permission',
        permission: 'permissions:update',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Archive permission',
        permission: 'permissions:archive',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Restore permission',
        permission: 'permissions:restore',
        roles: [{ name: RolesData.SUPERADMIN }],
      },

      // roles
      {
        description: 'Create role',
        permission: 'roles:create',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Read role',
        permission: 'roles:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update role',
        permission: 'roles:update',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Archive role',
        permission: 'roles:archive',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Restore role',
        permission: 'roles:restore',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Delete role',
        permission: 'roles:delete',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
    ],
  },
  {
    group: 'Users',
    entries: [
      {
        description: 'Create user',
        permission: 'users:create',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Read user',
        permission: 'users:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: { where: 'id:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Update user',
        permission: 'users:update',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update user avatar',
        permission: 'users:update-avatar',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: { where: 'id:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Archive user',
        permission: 'users:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore user',
        permission: 'users:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete user',
        permission: 'users:delete',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
    ],
  },
  {
    group: 'Notifications',
    entries: [
      // notification
      {
        description: 'Read notification',
        permission: 'notifications:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: { where: 'userId:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Delete notification',
        permission: 'notifications:delete',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            scope: { where: 'userId:$subject.user.id' },
          },
          {
            name: RolesData.ADMIN,
            scope: { where: 'userId:$subject.user.id' },
          },
          {
            name: RolesData.USER,
            scope: { where: 'userId:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Mark notification as read',
        permission: 'notifications:mark-read',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            scope: { where: 'userId:$subject.user.id' },
          },
          {
            name: RolesData.ADMIN,
            scope: { where: 'userId:$subject.user.id' },
          },
          {
            name: RolesData.USER,
            scope: { where: 'userId:$subject.user.id' },
          },
        ],
      },

      // message
      {
        description: 'Create notification message',
        permission: 'notification-messages:create',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Read notification message',
        permission: 'notification-messages:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: { where: 'notifications.userId:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Archive notification message',
        permission: 'notification-messages:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore notification message',
        permission: 'notification-messages:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete notification message',
        permission: 'notification-messages:delete',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },

      // deliveries
      {
        description: 'Read notification delivery',
        permission: 'notification-deliveries:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: { where: 'notification.userId:$subject.user.id' },
          },
        ],
      },
      {
        description: 'Retry notification delivery',
        permission: 'notification-deliveries:retry',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
    ],
  },
];
