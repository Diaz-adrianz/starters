export enum TokenType {
  INVITATION = 'invitation',
  SET_PASSWORD = 'set_password',
}

export const TokenTypeExpire: Record<TokenType, number> = {
  [TokenType.INVITATION]: 86400, // 1d
  [TokenType.SET_PASSWORD]: 600, // 10m
};
