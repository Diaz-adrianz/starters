import { Injectable } from '@nestjs/common';
import { DefaultStorageService } from '../../lib/storage/default/default-storage.service';
import { CreatePresignedPostDto } from './dto/create-presigned-post.dto';

@Injectable()
export class StorageService {
  constructor(private storage: DefaultStorageService) {}

  async createPresignedPost(dto: CreatePresignedPostDto) {
    return this.storage.createPresignedPost(dto);
  }
}
