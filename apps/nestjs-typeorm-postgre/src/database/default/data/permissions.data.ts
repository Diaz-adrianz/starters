import { Scope } from '../../../shared/interfaces/resource-scope.interface';
import { RolesData } from './roles.data';

export const PermissionsData: {
  group: string;
  entries: {
    description: string;
    permission: string;
    roles: { name: string; scope?: Scope }[];
  }[];
}[] = [
  {
    group: 'Access control',
    entries: [
      // permissions
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
            scope: [{ field: 'id', op: 'where', value: '{{subject.user.id}}' }],
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
            scope: [{ field: 'id', op: 'where', value: '{{subject.user.id}}' }],
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
      // delivery
      {
        description: 'Create delivery',
        permission: 'notification-deliveries:create',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Read delivery',
        permission: 'notification-deliveries:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },

      // template
      {
        description: 'Create template',
        permission: 'notification-templates:create',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Read template',
        permission: 'notification-templates:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update template',
        permission: 'notification-templates:update',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Archive template',
        permission: 'notification-templates:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore template',
        permission: 'notification-templates:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete template',
        permission: 'notification-templates:delete',
        roles: [{ name: RolesData.SUPERADMIN }],
      },

      // messages
      {
        description: 'Read message',
        permission: 'notification-messages:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
        ],
      },
      {
        description: 'Delete message',
        permission: 'notification-messages:delete',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
          {
            name: RolesData.ADMIN,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
          {
            name: RolesData.USER,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
        ],
      },
      {
        description: 'Mark message as read',
        permission: 'notification-messages:mark-read',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
          {
            name: RolesData.ADMIN,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
          {
            name: RolesData.USER,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
        ],
      },

      // push tokens
      {
        description: 'Read push token',
        permission: 'notification-push-tokens:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: [
              { field: 'userId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
        ],
      },
    ],
  },
];
