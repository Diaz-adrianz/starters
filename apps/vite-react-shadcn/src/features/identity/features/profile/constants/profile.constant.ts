import type { Option } from '@/utils/option';
import type { ProfileGender } from '../types/profile.type';

export const ProfileGenderMap: Record<ProfileGender, Option<ProfileGender>> = {
  male: { value: 'male', label: 'Male' },
  female: { value: 'female', label: 'Female' },
} as const;

export const ProfileGenderOptions = Object.values(ProfileGenderMap);

export const ProfileGenders = Object.keys(ProfileGenderMap);
