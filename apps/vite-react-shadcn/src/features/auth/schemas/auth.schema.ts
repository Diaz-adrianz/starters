import * as y from 'yup';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9._]*$/;

export const signInSchema = y.object({
  username: y
    .string()
    .trim()
    .required('Required')
    .test(
      'email-or-username',
      'Enter valid email or username',
      (val) =>
        !val || y.string().email().isValidSync(val) || USERNAME_REGEX.test(val)
    ),
  password: y.string().required('Required').min(8, 'Min 8 characters'),
});

export type SignInValues = y.InferType<typeof signInSchema>;
