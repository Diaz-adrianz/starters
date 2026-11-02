import * as y from 'yup';

// fields
// ---------------------------------------------------------------------------
const usernameMin = 3,
  usernameMax = 30;

const usernameSchema = y
  .string()
  .min(usernameMin, `Username must be at least ${usernameMin} characters`)
  .max(usernameMax, `Username must be at most ${usernameMax} characters`)
  .matches(
    /^[a-zA-Z][a-zA-Z0-9._]*$/,
    'Username must start with a letter and contain only letters, numbers, dots, or underscores'
  );

// ---------------------------------------------------------------------------

const inviteUserSchema = y.object({
  username: usernameSchema.required(),
  email: y.string().email().required(),
});

type InviteUserValues = y.InferType<typeof inviteUserSchema>;

export { inviteUserSchema };
export type { InviteUserValues };
