import { isBooleanString, isDateString, isNumberString } from 'class-validator';

export const castValue = (value: string) => {
  if (isNumberString(value)) return Number(value);
  else if (isBooleanString(value)) return value === 'true';
  else if (value == 'null') return null;
  else if (isDateString(value)) return new Date(value);

  return value;
};
