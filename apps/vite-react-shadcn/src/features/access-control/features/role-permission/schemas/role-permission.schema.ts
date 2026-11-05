import * as y from 'yup';
import type { RoleComboboxItem } from '../../role/components/role-combobox';
import type { PermissionComboboxItem } from '../../permission';

const createRolePermissionSchema = y.object({
  permission: y.mixed<PermissionComboboxItem>().required(),
  role: y.mixed<RoleComboboxItem>().required(),
});

type CreateRolePermissionValues = y.InferType<
  typeof createRolePermissionSchema
>;

export { createRolePermissionSchema };
export type { CreateRolePermissionValues };
