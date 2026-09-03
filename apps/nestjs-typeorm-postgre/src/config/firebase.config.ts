import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  FIREBASE_DEFAULT_SERVICEACCOUNT_PATH: z.string(),
});

export const firebaseConfig = registerAs('firebase', () => {
  const { success, error, data } = schema.safeParse(process.env);

  if (!success)
    throw new Error(`[firebase.config] validation failed:\n- ${error.message}`);

  return {
    default: {
      serviceAccountPath: data.FIREBASE_DEFAULT_SERVICEACCOUNT_PATH,
    },
  };
});

export const FIREBASE_CONFIG_KEY = firebaseConfig.KEY;

export type FirebaseConfig = ConfigType<typeof firebaseConfig>;
