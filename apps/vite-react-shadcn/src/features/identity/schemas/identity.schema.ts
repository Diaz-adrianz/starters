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

const forgotPasswordSchema = y.object({
  email: y.string().email().required(),
});

type ForgotPasswordValues = y.InferType<typeof forgotPasswordSchema>;

const setPasswordCheckSchema = y.object({
  otp: y.string().length(6).required(),
});

type SetPasswordCheckValues = y.InferType<typeof setPasswordCheckSchema>;

const setPasswordSchema = y.object({
  otp: y.string().length(6).required(),
  password: strongPassword.required(),
  matchPassword: y
    .string()
    .required()
    .oneOf([y.ref('password')], 'Passwords must match'),
});

type SetPasswordValues = y.InferType<typeof acceptInviteSchema>;

export {
  acceptInviteCheckSchema,
  acceptInviteSchema,
  forgotPasswordSchema,
  setPasswordCheckSchema,
  setPasswordSchema,
};
export type {
  AcceptInviteCheckValues,
  AcceptInviteValues,
  ForgotPasswordValues,
  SetPasswordCheckValues,
  SetPasswordValues,
};
