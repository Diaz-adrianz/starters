export interface JwtAccessPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface JwtAccessAuthResult {
  token: string;
  payload: {
    user: { id: string; name: string };
    roles: { id: string; name: string }[];
    session: { id: string };
  };
}
