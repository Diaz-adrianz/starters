import z from 'zod';

const createRoleSchema = z.object({
  name: z.string().trim().min(1),
  enabled: z.boolean().optional(),
});

type CreateRoleValues = z.infer<typeof createRoleSchema>;

const updateRoleSchema = z.object({
  name: z.string().trim().min(1).optional(),
  enabled: z.boolean().optional(),
});

type UpdateRoleValues = z.infer<typeof updateRoleSchema>;

export { createRoleSchema, updateRoleSchema };
export type { CreateRoleValues, UpdateRoleValues };
