import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DefaultStorageService } from '../default-storage.service';
import { stringifyBytes } from '../../../../shared/utils/string.util';
import {
  MediaExtensions,
  MediaMimeType,
} from '../../../../shared/constants/media-types.constant';
import { fileTypeFromStream } from 'file-type';

interface IsStorageFileOptions {
  mimeTypes?: MediaMimeType[];
  maxBytes?: number;
}

@ValidatorConstraint({ name: 'IsStorageFile', async: true })
@Injectable()
export class IsStorageFileConstraint implements ValidatorConstraintInterface {
  private lastError = '';

  constructor(private readonly storageService: DefaultStorageService) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    const prop = args.property ?? 'File';

    if (typeof value !== 'string' || !value) {
      this.lastError = `${prop} key must be a non-empty string`;
      return false;
    }

    const [options] = args.constraints as [IsStorageFileOptions];

    try {
      const head = await this.storageService.headObject(value);

      if (options?.maxBytes && (head.ContentLength ?? 0) > options.maxBytes) {
        this.lastError = `${prop} size exceeds maximum of ${stringifyBytes(options.maxBytes)}`;
        return false;
      }

      if (options?.mimeTypes?.length) {
        const stream = await this.storageService.getObject(
          value,
          'bytes=0-4095',
        );
        if (!stream) {
          this.lastError = `${prop} is not readable`;
          return false;
        }

        const fileType = await fileTypeFromStream(
          stream.transformToWebStream(),
        );
        const contentType = fileType?.mime ?? '';

        if (!options.mimeTypes.includes(contentType as MediaMimeType)) {
          this.lastError = `${prop} type ${MediaExtensions[contentType] ?? 'unknown'} is not allowed`;
          return false;
        }
      }

      return true;
    } catch {
      this.lastError = `${prop} does not exist`;
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
      validator: IsStorageFileConstraint,
    });
  };
}
