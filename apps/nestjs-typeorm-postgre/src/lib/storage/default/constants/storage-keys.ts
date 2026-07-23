export const StoragePrefixes = {
  tmp: 'tmp/',
  public: 'public/',
};

export const StorageKeys = {
  tmp: (key?: string) => `${StoragePrefixes.tmp}${key ?? ''}`,
  avatar: (userId?: string, ext?: string) =>
    `${StoragePrefixes.public}user-avatars/${userId ?? ''}${ext ?? ''}`,
};
