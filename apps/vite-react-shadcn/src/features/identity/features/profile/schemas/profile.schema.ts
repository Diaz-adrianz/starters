import * as y from 'yup';
import { ProfileGenders } from '../constants/profile.constant';
import {
  matchesPhoneNumber,
  nullableString,
  testDateString,
} from '@/utils/yup';

const createProfileSchema = y.object({
  firstName: y.string().max(100).required(),
  lastName: y.string().max(100).required(),
  phoneNumber: nullableString.matches(...matchesPhoneNumber),
  dateOfBirth: nullableString.test(...testDateString),
  gender: nullableString.oneOf(ProfileGenders),
  bio: nullableString.max(500),
});

type CreateProfileValues = y.InferType<typeof createProfileSchema>;

const updateProfileSchema = createProfileSchema;

type UpdateProfileValues = y.InferType<typeof updateProfileSchema>;

export { createProfileSchema, updateProfileSchema };
export type { CreateProfileValues, UpdateProfileValues };
