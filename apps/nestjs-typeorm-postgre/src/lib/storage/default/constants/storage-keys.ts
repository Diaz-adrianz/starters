export const StorageKeys = {
  tmp: (key?: string) => `tmp/${key ?? ''}`,
  avatar: (userId?: string) => `public/user-avatars/${userId ?? ''}`,
};
