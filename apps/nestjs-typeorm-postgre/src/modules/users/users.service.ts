import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindAllOptions } from '../../common/classes/findall-query';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const sameEmail = await this.userRepo.count({
      where: { email: createUserDto.email },
    });
    if (sameEmail) throw new BadRequestException('Email has been registered');

    const sameUsername = await this.userRepo.count({
      where: { username: createUserDto.username },
    });
    if (sameUsername) throw new BadRequestException('Username already exist');

    const user = this.userRepo.create(createUserDto);
    return this.userRepo.insert(user);
  }

  findAll(queryOptions: FindAllOptions) {
    return this.userRepo.findAndCount(queryOptions);
  }

  findOne(id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }

  softDelete(id: string) {
    return this.userRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.userRepo.restore({ id });
  }

  delete(id: string) {
    return this.userRepo.delete({ id });
  }
}
