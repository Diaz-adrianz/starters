import { FIELDS_SEPARATOR } from '../../interfaces/resource-query.interface';

export class ResolveContextException extends Error {
  constructor(public path: string) {
    super(`Context path "${path}" could not be resolved`);
  }
}

export class FieldConflictException extends Error {
  constructor(public fields: string[]) {
    super(`Field conflict: "${fields.join(FIELDS_SEPARATOR)}"`);
  }
}
