export class AuthContext {
  userId: string;
  username: string;
  sessionId: string;
  roles: string[];
  hasPermission?: boolean;
}
