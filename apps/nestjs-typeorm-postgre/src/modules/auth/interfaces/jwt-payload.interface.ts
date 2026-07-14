export interface AccessTokenPayload {
  sub: string;
  usn: string;
  iat?: number;
  exp?: number;
  iss?: string;
}
