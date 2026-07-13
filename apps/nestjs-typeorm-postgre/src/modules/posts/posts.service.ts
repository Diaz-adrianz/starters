import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { FindAllQuery } from '../../common/classes/findall-query';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  create(createPostDto: CreatePostDto) {
    return this.postRepo.insert(createPostDto);
  }

  findAll(query: FindAllQuery['query']) {
    return this.postRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.postRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepo.update({ id }, updatePostDto);
  }

  remove(id: string) {
    return this.postRepo.delete({ id });
  }
}
