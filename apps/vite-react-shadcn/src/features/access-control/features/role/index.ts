// api
export { useRole } from './api/role.query';

// components
export {
  RoleList,
  RoleListSearchFilter,
  RoleListTrashFilter,
  RoleListTable,
} from './components/role-list';
export { RoleCard, RoleCardSkeleton } from './components/role-card';
export { RoleActions } from './components/role-actions';
export { RoleCreateDialog } from './components/role-create-dialog';
export {
  RoleUpdateDialog,
  type RoleUpdateDialogPayload,
} from './components/role-update-dialog';
export {
  RoleCombobox,
  type RoleComboboxItem,
} from './components/role-combobox';

// hooks
export { useRoleMutations } from './hooks/use-role-mutations';

// types
export { type Role } from './types/role.type';
