import { strongPassword } from '@/utils/yup';
import * as y from 'yup';

const acceptInviteCheckSchema = y.object({
  otp: y.string().length(6).required(),
});

type AcceptInviteCheckValues = y.InferType<typeof acceptInviteCheckSchema>;

const acceptInviteSchema = y.object({
  otp: y.string().length(6).required(),
  password: strongPassword.required(),
  matchPassword: y
    .string()
    .required()
    .oneOf([y.ref('password')], 'Passwords must match'),
});

type AcceptInviteValues = y.InferType<typeof acceptInviteSchema>;

export { acceptInviteCheckSchema, acceptInviteSchema };
export type { AcceptInviteCheckValues, AcceptInviteValues };
