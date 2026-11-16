import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from '../../infra/store/store.service';
import { StorageService } from './storage.service';
import { CreateUploadDto } from './dto/create-upload.dto';

@Controller('storage')
export class StorageController {
  constructor(
    private storageService: StorageService,
    private store: StoreService,
  ) {}

  @Post('/upload')
  createUpload(@Body() dto: CreateUploadDto) {
    dto.ownerId = this.store.user.id;
    return this.storageService.createUpload(dto);
  }
}
