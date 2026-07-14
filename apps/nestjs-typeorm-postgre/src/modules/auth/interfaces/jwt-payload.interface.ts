export interface JwtTokenPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
  iss?: string;
}
