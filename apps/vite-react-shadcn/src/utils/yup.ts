import * as y from 'yup';

export const nullish = <T extends y.AnySchema>(schema: T) =>
  schema
    .transform((v) => (typeof v === 'string' && v.trim() === '' ? null : v))
    .nullable()
    .optional();
