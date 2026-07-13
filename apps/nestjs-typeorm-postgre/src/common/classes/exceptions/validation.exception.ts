import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export class ValidationException extends HttpException {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation Error', HttpStatus.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }

  formatErrors(
    errors: ValidationError[] = this.errors,
    parentPath = '',
  ): { field: string; errors: string[] }[] {
    return errors.flatMap((err) => {
      const path = parentPath ? `${parentPath}.${err.property}` : err.property;

      const currentErrors = err.constraints
        ? [{ field: path, errors: Object.values(err.constraints) }]
        : [];

      const childErrors = err.children?.length
        ? this.formatErrors(err.children, path)
        : [];

      return [...currentErrors, ...childErrors];
    });
  }
}
