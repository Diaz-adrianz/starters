import { Condition } from '../../../../modules/access-control/interfaces/condition.interface';
import { RolesData } from './roles.data';

export const PermissionsData: {
  name: string;
  entries: {
    description: string;
    permission: string;
    roles: { name: string; condition?: Condition }[];
  }[];
}[] = [
  {
    name: 'auth',
    entries: [
      // session
      {
        description: 'Read session',
        permission: 'session:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          {
            name: RolesData.ADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Revoke session',
        permission: 'session:revoke',
        roles: [
          { name: RolesData.SUPERADMIN },
          {
            name: RolesData.ADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Delete session',
        permission: 'session:delete',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.ADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
    ],
  },
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
      // user
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
            condition: { id: { eq: '{{actor.id}}' } },
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
            condition: { id: { eq: '{{actor.id}}' } },
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

      // profile
      {
        description: 'Read profile',
        permission: 'profile:read',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Update profile',
        permission: 'profile:update',
        roles: [
          { name: RolesData.SUPERADMIN },
          { name: RolesData.ADMIN },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Archive profile',
        permission: 'profile:archive',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Restore profile',
        permission: 'profile:restore',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
      {
        description: 'Delete profile',
        permission: 'profile:delete',
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
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Delete message',
        permission: 'message:delete',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.ADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
      {
        description: 'Mark message as read',
        permission: 'message:mark-read',
        roles: [
          {
            name: RolesData.SUPERADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.ADMIN,
            condition: { userId: { eq: '{{actor.id}}' } },
          },
          {
            name: RolesData.USER,
            condition: { userId: { eq: '{{actor.id}}' } },
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
            condition: { userId: { eq: '{{actor.id}}' } },
          },
        ],
      },
    ],
  },
  {
    name: 'portal',
    entries: [
      {
        description: 'Access administrator portal',
        permission: 'administrator:access',
        roles: [{ name: RolesData.SUPERADMIN }, { name: RolesData.ADMIN }],
      },
    ],
  },
];
