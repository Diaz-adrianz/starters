export type User = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  avatar?: string | null;
  verifiedAt?: string | null;
};
