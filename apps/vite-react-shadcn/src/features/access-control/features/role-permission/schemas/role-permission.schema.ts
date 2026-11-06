import * as y from 'yup';
import type { RoleComboboxItem } from '../../role/components/role-combobox';
import type { PermissionComboboxItem } from '../../permission';
import { nullableString } from '@/utils/yup';

const createRolePermissionSchema = y.object({
  permission: y.mixed<PermissionComboboxItem>().required(),
  role: y.mixed<RoleComboboxItem>().required(),
  condition: nullableString,
});

type CreateRolePermissionValues = y.InferType<
  typeof createRolePermissionSchema
>;

export { createRolePermissionSchema };
export type { CreateRolePermissionValues };
