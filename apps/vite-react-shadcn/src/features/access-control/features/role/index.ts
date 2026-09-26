// api
export { useRole } from './api/role.query';

// components
export {
  RoleList,
  RoleListItemGroup,
  RoleListPagination,
  RoleListSearchBox,
} from './components/role-list';
export {
  RoleItem,
  RoleItemSkeleton,
  RoleItemActionMenu,
} from './components/role-item';
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

// types
export { type Role } from './types/role.type';
