import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['development', 'staging', 'production']),
  BASE_URL: z.string(),
  API_URL: z.url(),
});

const parsed = envSchema.safeParse({
  MODE: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL,
  API_URL: import.meta.env.VITE_API_URL,
});

if (!parsed.success) {
  console.error('Invalid environment variables', z.treeifyError(parsed.error));
  throw new Error(`Invalid environment variables`);
}

export const EnvConfig = parsed.data;
