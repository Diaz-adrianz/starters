import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from '../../infra/store/store.service';
import { StorageService } from './storage.service';
import { CreatePresignedPostDto } from './dto/create-presigned-post.dto';

@Controller('storage')
export class StorageController {
  constructor(
    private storageService: StorageService,
    private store: StoreService,
  ) {}

  @Post('/presigned-post')
  createPresignedPost(@Body() dto: CreatePresignedPostDto) {
    dto.ownerId = this.store.user.id;
    return this.storageService.createPresignedPost(dto);
  }
}
