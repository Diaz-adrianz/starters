import * as crypto from 'crypto';

export const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s, 'utf8').digest('hex');

export const generateRandomString = (length = 16) => {
  const byteLength = Math.ceil((length * 3) / 4);
  return crypto.randomBytes(byteLength).toString('base64url').slice(0, length);
};

export const stringifyBytes = (bytes: number = 2, decimals = 2) => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(decimals)} ${units[i]}`;
};
