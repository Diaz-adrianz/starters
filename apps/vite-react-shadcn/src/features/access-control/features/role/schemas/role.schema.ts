import z from 'zod';

const createRoleSchema = z.object({
  name: z.string().trim().min(1),
  enabled: z.boolean().optional(),
});

type CreateRoleValues = z.infer<typeof createRoleSchema>;

export { createRoleSchema };
export type { CreateRoleValues };
