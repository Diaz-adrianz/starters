export interface AccessTokenPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
  iss?: string;
}
