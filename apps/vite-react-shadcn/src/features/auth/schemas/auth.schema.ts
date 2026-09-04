import z from 'zod';

export const signInSchema = z.object({
  username: z
    .string()
    .min(1, 'Required')
    .refine(
      (val) =>
        z.email().safeParse(val).success ||
        /^[a-zA-Z][a-zA-Z0-9._]*$/.test(val),
      'Enter valid email or username'
    ),
  password: z.string().min(8, 'Min 8 characters'),
});

export type SignInValues = z.infer<typeof signInSchema>;
