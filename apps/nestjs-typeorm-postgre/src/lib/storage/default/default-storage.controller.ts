import { Body, Controller, Post } from '@nestjs/common';
import { DefaultStorageService } from './default-storage.service';
import { CreatePresignedPostDto } from './dto/create-presigned-post.dto';
import { StoreService } from '../../../infra/store/store.service';

@Controller('storage/default')
export class DefaultStorageController {
  constructor(
    private storageService: DefaultStorageService,
    private store: StoreService,
  ) {}

  @Post('/presigned-post')
  createPresignedPost(@Body() dto: CreatePresignedPostDto) {
    dto.ownerId = this.store.actor.id;
    return this.storageService.createPresignedPost(dto);
  }
}
