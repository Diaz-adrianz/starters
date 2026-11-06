import * as y from 'yup';

const createRoleSchema = y.object({
  name: y.string().required(),
  enabled: y.boolean().optional(),
});

type CreateRoleValues = y.InferType<typeof createRoleSchema>;

const updateRoleSchema = y.object({
  name: y.string().optional(),
  enabled: y.boolean().optional(),
});

type UpdateRoleValues = y.InferType<typeof updateRoleSchema>;

export { createRoleSchema, updateRoleSchema };
export type { CreateRoleValues, UpdateRoleValues };
