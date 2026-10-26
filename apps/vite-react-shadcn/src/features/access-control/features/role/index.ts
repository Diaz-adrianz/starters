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
export { RoleMenuActions } from './components/role-menu';
export { RoleCreateDialog } from './components/role-create-dialog';
export {
  RoleUpdateDialog,
  type RoleUpdateDialogPayload,
} from './components/role-update-dialog';

export {
  RoleUserList,
  RoleUserListSearchFilter,
  RoleUserListTable,
} from './components/role-user-list';

export {
  RolePermissionList,
  RolePermissionListSearchFilter,
  RolePermissionListTable,
} from './components/role-permission-list';

// hooks
export { useRoleMutations } from './hooks/use-role-mutations';

// types
export { type Role } from './types/role.type';
