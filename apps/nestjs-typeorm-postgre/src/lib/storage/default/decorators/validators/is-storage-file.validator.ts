import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, Injectable } from '@nestjs/common';
import { MediaMimeType } from '../../../../../shared/constants/media-types.constant';
import { DefaultStorageService } from '../../default-storage.service';
import { StoreService } from '../../../../../infra/store/store.service';
import { StorageFileValidationError } from '../../classes/exceptions/storage.exception';
import { LoggerService } from '../../../../../infra/logger/logger.service';

interface IsStorageFileOptions {
  mimeTypes?: MediaMimeType[];
  maxSize?: number;
}

export interface IsStorageFileResult {
  key: string;
  etag: string;
}

@ValidatorConstraint({ name: 'IsStorageFile', async: true })
@Injectable()
export class IsStorageFileValidator implements ValidatorConstraintInterface {
  private lastError = '';

  constructor(
    private readonly storageService: DefaultStorageService,
    private readonly store: StoreService,
    private readonly logger: LoggerService,
  ) {}

  async validate(key: unknown, args: ValidationArguments): Promise<boolean> {
    const prop = args.property;

    if (typeof key !== 'string' || !key) {
      this.lastError = `${prop} key must be a non-empty string`;
      return false;
    }

    const [options] = args.constraints as [IsStorageFileOptions];

    try {
      this.storageService.validateTempOwner(key, this.store.actor.id);

      const validated = await this.storageService.validateFile(
        key,
        options,
        prop,
      );
      const result: IsStorageFileResult = {
        key: validated.key,
        etag: validated.etag,
      };
      args.object[args.property] = result;
      return true;
    } catch (e) {
      if (!(
        e instanceof StorageFileValidationError || e instanceof HttpException
      ))
        this.logger.error(
          `Failed to validate ${prop} ${key}:`,
          e,
          this.constructor.name,
        );

      this.lastError =
        e instanceof StorageFileValidationError || e instanceof HttpException
          ? e.message
          : `${args.property} could not be verified`;

      return false;
    }
  }

  defaultMessage(): string {
    return this.lastError || 'Invalid file';
  }
}

export function IsStorageFile(
  options?: IsStorageFileOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsStorageFile',
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsStorageFileValidator,
    });
  };
}
