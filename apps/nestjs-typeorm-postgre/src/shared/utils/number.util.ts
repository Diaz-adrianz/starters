import { randomInt } from 'crypto';

export const KB = 1024;

export const MB = 1024 * KB;

export const GB = 1024 * MB;

export const generateOtp = (length = 6): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return randomInt(min, max).toString();
};
