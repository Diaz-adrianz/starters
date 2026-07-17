import * as crypto from 'crypto';

export const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s, 'utf8').digest('hex');

export const generateRandomString = (length = 16) => {
  const byteLength = Math.ceil((length * 3) / 4);
  return crypto.randomBytes(byteLength).toString('base64url').slice(0, length);
};
