import z from 'zod';
import { ProfileGenders } from '../constants/profile.constant';

const createProfileSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, 'Invalid phone number')
    .optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(ProfileGenders).optional(),
  bio: z.string().max(500).optional(),
});

type CreateProfileValues = z.infer<typeof createProfileSchema>;

const updateProfileSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, 'Invalid phone number')
    .optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(ProfileGenders).optional(),
  bio: z.string().max(500).optional(),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export { createProfileSchema, updateProfileSchema };
export type { CreateProfileValues, UpdateProfileValues };
