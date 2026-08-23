import { Scope } from '../../../shared/interfaces/resource-scope.interface';
import { RolesData } from './roles.data';

export const PermissionsData: {
  name: string;
  entries: {
    description: string;
    permission: string;
    roles: { name: string; scope?: Scope }[];
  }[];
}[] = [
  {
    name: 'access-control',
    entries: [
      // permission
      {
        description: 'Read permission',
        permission: 'permission:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update permission',
        permission: 'permission:update',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Archive permission',
        permission: 'permission:archive',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Restore permission',
        permission: 'permission:restore',
        roles: [{ name: RolesData.SUPERADMIN }],
      },

      // role
      {
        description: 'Create role',
        permission: 'role:create',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Read role',
        permission: 'role:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update role',
        permission: 'role:update',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Archive role',
        permission: 'role:archive',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Restore role',
        permission: 'role:restore',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Delete role',
        permission: 'role:delete',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
    ],
  },
  {
    name: 'identity',
    entries: [
      {
        description: 'Create user',
        permission: 'user:create',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Read user',
        permission: 'user:read',
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
        permission: 'user:update',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update user avatar',
        permission: 'user:update-avatar',
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
        permission: 'user:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore user',
        permission: 'user:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete user',
        permission: 'user:delete',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
    ],
  },
  {
    name: 'notification',
    entries: [
      // delivery
      {
        description: 'Create delivery',
        permission: 'delivery:create',
        roles: [{ name: RolesData.SUPERADMIN }],
      },
      {
        description: 'Read delivery',
        permission: 'delivery:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },

      // template
      {
        description: 'Create template',
        permission: 'template:create',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Read template',
        permission: 'template:read',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Update template',
        permission: 'template:update',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Archive template',
        permission: 'template:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore template',
        permission: 'template:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete template',
        permission: 'template:delete',
        roles: [{ name: RolesData.SUPERADMIN }],
      },

      // message
      {
        description: 'Read message',
        permission: 'message:read',
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
        permission: 'message:delete',
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
        permission: 'message:mark-read',
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

      // push token
      {
        description: 'Read push token',
        permission: 'push-token:read',
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
  {
    name: 'tracker',
    entries: [
      {
        description: 'Read activity',
        permission: 'activity:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            scope: [
              { field: 'actorType', op: 'where', value: 'user' },
              { field: 'actorId', op: 'where', value: '{{subject.user.id}}' },
            ],
          },
        ],
      },
    ],
  },
];
