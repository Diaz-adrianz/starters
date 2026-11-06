import * as y from 'yup';
import type { RoleComboboxItem } from '../../role/components/role-combobox';
import type { UserComboboxItem } from '@/features/identity';

const createRoleUserSchema = y.object({
  user: y.mixed<UserComboboxItem>().required(),
  role: y.mixed<RoleComboboxItem>().required(),
});

type CreateRoleUserValues = y.InferType<typeof createRoleUserSchema>;

export { createRoleUserSchema };
export type { CreateRoleUserValues };
