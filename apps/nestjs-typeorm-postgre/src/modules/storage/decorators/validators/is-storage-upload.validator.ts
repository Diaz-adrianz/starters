import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, Injectable } from '@nestjs/common';
import { MediaMimeType } from '../../../../shared/constants/media-types.constant';
import { StorageService } from '../../storage.service';
import { StoreService } from '../../../../infra/store/store.service';
import { LoggerService } from '../../../../infra/logger/logger.service';

interface IsStorageUploadOptions {
  mimeTypes?: MediaMimeType[];
  maxSize?: number;
}

export interface IsStorageUploadResult {
  key: string;
  etag: string;
}

@ValidatorConstraint({ name: 'IsStorageUpload', async: true })
@Injectable()
export class IsStorageUploadValidator implements ValidatorConstraintInterface {
  private lastError = '';

  constructor(
    private readonly storageService: StorageService,
    private readonly store: StoreService,
    private readonly logger: LoggerService,
  ) {}

  async validate(key: unknown, args: ValidationArguments): Promise<boolean> {
    const prop = args.property;

    if (typeof key !== 'string' || !key) {
      this.lastError = `${prop} key must be a non-empty string`;
      return false;
    }

    const [options] = args.constraints as [IsStorageUploadOptions];

    try {
      const validated = await this.storageService.validateUpload({
        name: prop,
        key,
        ownerId: this.store.user.id,
        format: { mimeTypes: options.mimeTypes, maxSize: options.maxSize },
      });
      const result: IsStorageUploadResult = {
        key: validated.key,
        etag: validated.etag,
      };
      args.object[args.property] = result;
      return true;
    } catch (e) {
      if (!(e instanceof HttpException))
        this.logger.error(
          `Failed to validate ${prop} ${key}:`,
          e,
          this.constructor.name,
        );

      this.lastError =
        e instanceof HttpException
          ? e.message
          : `${args.property} could not be verified`;

      return false;
    }
  }

  defaultMessage(): string {
    return this.lastError || 'Invalid file';
  }
}

export function IsStorageUpload(
  options?: IsStorageUploadOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsStorageUpload',
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsStorageUploadValidator,
    });
  };
}
