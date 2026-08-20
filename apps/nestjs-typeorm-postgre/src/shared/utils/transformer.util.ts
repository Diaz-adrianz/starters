import { isBooleanString, isDateString, isNumberString } from 'class-validator';

type CastType = 'string' | 'number' | 'boolean' | 'date' | 'null';

type CastResult<T extends CastType> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : T extends 'date'
        ? Date
        : null;

export const castValue = <T extends CastType>(
  value: string,
  allowed?: readonly T[],
): CastResult<T> => {
  const check = (t: CastType) => !allowed || allowed.includes(t as T);

  if (check('number') && isNumberString(value))
    return Number(value) as CastResult<T>;

  if (check('boolean') && isBooleanString(value))
    return (value === 'true') as CastResult<T>;

  if (check('null') && value === 'null') return null as CastResult<T>;

  if (check('date') && isDateString(value))
    return new Date(value) as CastResult<T>;

  return value as CastResult<T>;
};

export const escapeRegex = (char: string) =>
  char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
