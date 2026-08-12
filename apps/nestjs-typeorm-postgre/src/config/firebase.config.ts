import { ConfigType, registerAs } from '@nestjs/config';
import * as yup from 'yup';

const schema = yup.object({
  FIREBASE_DEFAULT_SERVICEACCOUNT_PATH: yup.string().required(),
});

export const firebaseConfig = registerAs('firebase', () => {
  try {
    const value = schema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      default: {
        serviceAccountPath: value.FIREBASE_DEFAULT_SERVICEACCOUNT_PATH,
      },
    };
  } catch (error) {
    throw new Error(
      `[firebase.config] validation failed:\n- ${(error as yup.ValidationError).errors.join('\n- ')}`,
    );
  }
});

export const FIREBASE_CONFIG_KEY = firebaseConfig.KEY;

export type FirebaseConfig = ConfigType<typeof firebaseConfig>;
