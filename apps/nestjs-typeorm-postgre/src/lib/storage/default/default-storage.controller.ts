import { Controller } from '@nestjs/common';
import { DefaultStorageService } from './default-storage.service';

@Controller('storage/default')
export class DefaultStorageController {
  constructor(private storageService: DefaultStorageService) {}
}
