// api
export { useRole } from './api/role.query';

// components
export {
  RoleList,
  RoleListSearchFilter,
  RoleListTable,
} from './components/role-list';
export { RoleCard, RoleCardSkeleton } from './components/role-card';
export {
  RoleUserList,
  RoleUserListItemGroup,
  RoleUserListPagination,
  RoleUserListSearchBox,
  useRoleUserList,
} from './components/role-user-list';
export {
  RoleUserItem,
  RoleUserItemSkeleton,
  RoleUserItemActionMenu,
} from './components/role-user-item';
export {
  RolePermissionList,
  RolePermissionListItemGroup,
  RolePermissionListPagination,
  RolePermissionListSearchBox,
  useRolePermissionList,
} from './components/role-permission-list';
export {
  RolePermissionItem,
  RolePermissionItemSkeleton,
  RolePermissionItemActionMenu,
} from './components/role-permission-item';

// types
export { type Role } from './types/role.type';
