export interface JwtRefreshPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface JwtRefreshAuthResult {
  token: string;
  payload: {
    user: { id: string };
    session: { id: string };
  };
}
