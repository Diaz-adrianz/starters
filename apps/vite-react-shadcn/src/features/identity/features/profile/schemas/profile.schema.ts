import * as y from 'yup';
import { ProfileGenders } from '../constants/profile.constant';
import { nullish } from '@/utils/yup';

const createProfileSchema = y.object({
  firstName: y.string().max(100).required(),
  lastName: y.string().max(100).required(),
  phoneNumber: nullish(
    y.string().matches(/^\+[1-9]\d{6,14}$/, {
      message: 'Invalid phone number',
      excludeEmptyString: true,
    })
  ),
  dateOfBirth: nullish(y.date().typeError('Invalid date')),
  gender: nullish(y.string().oneOf(ProfileGenders)),
  bio: nullish(y.string().max(500)),
});

type CreateProfileValues = y.InferType<typeof createProfileSchema>;

const updateProfileSchema = createProfileSchema;

type UpdateProfileValues = y.InferType<typeof updateProfileSchema>;

export { createProfileSchema, updateProfileSchema };
export type { CreateProfileValues, UpdateProfileValues };
