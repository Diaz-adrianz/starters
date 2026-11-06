import * as y from 'yup';

const updatePermissionSchema = y.object({
  description: y.string().optional(),
  enabled: y.boolean().optional(),
});

type UpdatePermissionValues = y.InferType<typeof updatePermissionSchema>;

export { updatePermissionSchema };
export type { UpdatePermissionValues };
