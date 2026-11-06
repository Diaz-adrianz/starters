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

// Mask
// ------------------------------------------------------------------------------------
export interface MaskOptions {
  start?: number; // visible chars at start, default 1
  end?: number; // visible chars at end, default 0
  char?: string; // default '*'
  full?: boolean; // mask everything
  fixedLength?: number; // hide real length
}

export const maskString = (value: string, opts: MaskOptions = {}): string => {
  const { start = 1, end = 0, char = '*', full = false, fixedLength } = opts;
  if (!value) return '';
  const len = value.length;

  if (full || start + end >= len) return char.repeat(fixedLength ?? len);

  const middle = char.repeat(fixedLength ?? len - start - end);
  return value.slice(0, start) + middle + (end ? value.slice(-end) : '');
};

export const maskEmailString = (
  email: string,
  opts: { local?: MaskOptions; domain?: MaskOptions } = {},
): string => {
  const at = email.lastIndexOf('@');
  if (at < 1) return maskString(email, { full: true });

  const local = maskString(email.slice(0, at), { start: 1, ...opts.local });
  const domain = email.slice(at + 1);

  if (!opts.domain) return `${local}@${domain}`;

  const dot = domain.lastIndexOf('.');
  const name = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : '';

  return `${local}@${maskString(name, { start: 0, ...opts.domain })}${tld}`;
};
// ------------------------------------------------------------------------------------
