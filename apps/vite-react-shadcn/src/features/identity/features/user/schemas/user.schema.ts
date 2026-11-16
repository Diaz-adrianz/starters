import type { MimeType } from '@/constants/mimetype.constant';
import { type RoleComboboxItem } from '@/features/access-control';
import * as y from 'yup';

// fields
// ---------------------------------------------------------------------------
const USER_AVATAR_MIME_TYPES: MimeType[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const USER_AVATAR_MAX_SIZE = 3 * 1024 * 1024;

const USER_USERNAME_MIN = 3,
  USER_USERNAME_MAX = 30;

const usernameSchema = y
  .string()
  .min(
    USER_USERNAME_MIN,
    `Username must be at least ${USER_USERNAME_MIN} characters`
  )
  .max(
    USER_USERNAME_MAX,
    `Username must be at most ${USER_USERNAME_MAX} characters`
  )
  .matches(
    /^[a-zA-Z][a-zA-Z0-9._]*$/,
    'Username must start with a letter and contain only letters, numbers, dots, or underscores'
  );

// ---------------------------------------------------------------------------

const inviteUserSchema = y.object({
  username: usernameSchema.required(),
  email: y.string().email().required(),
  roles: y.array().of(y.mixed<RoleComboboxItem>().defined()).optional(),
});

type InviteUserValues = y.InferType<typeof inviteUserSchema>;

const updateUserAvatarSchema = y.object({
  username: usernameSchema.required(),
  email: y.string().email().required(),
  roles: y.array().of(y.mixed<RoleComboboxItem>().defined()).optional(),
});

type UpdateUserAvatarValues = y.InferType<typeof updateUserAvatarSchema>;

export {
  USER_AVATAR_MIME_TYPES,
  USER_AVATAR_MAX_SIZE,
  inviteUserSchema,
  updateUserAvatarSchema,
};
export type { InviteUserValues, UpdateUserAvatarValues };
