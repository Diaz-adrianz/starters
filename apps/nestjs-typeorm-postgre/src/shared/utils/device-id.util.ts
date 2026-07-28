import * as crypto from 'crypto';

export const generateDeviceId = (length = 12): string => {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
};

export const extractSignedDeviceId = (signedValue: string) => {
  const [deviceId, signature] = signedValue.split('.');
  if (!deviceId || !signature) return null;
  return { deviceId, signature };
};

export const signDeviceId = (secret: string, deviceId: string): string => {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(deviceId)
    .digest('hex');
  return `${deviceId}.${signature}`;
};

export const verifyDeviceId = (
  secret: string,
  deviceId: string,
  signature: string,
): string | null => {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(deviceId)
    .digest('hex');

  const valid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );

  return valid ? deviceId : null;
};
