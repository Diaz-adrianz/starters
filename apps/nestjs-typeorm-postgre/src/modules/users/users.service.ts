import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindAllOptions } from '../../shared/classes/findall-query.class';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const sameEmail = await this.userRepo.count({
      where: { email: email },
    });
    if (sameEmail) throw new BadRequestException('Email has been registered');

    const sameUsername = await this.userRepo.count({
      where: { username: username },
    });
    if (sameUsername) throw new BadRequestException('Username already exist');

    const user = this.userRepo.create({ email, username, password });
    await this.userRepo.save(user);
    return user;
  }

  findAll(queryOptions: FindAllOptions) {
    return this.userRepo.findAndCount(queryOptions);
  }

  findOne(id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  findByUsernameOrEmail(value: string) {
    return this.userRepo.findOneOrFail({
      where: [{ username: value }, { email: value }],
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }

  async updatePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt(10),
      hashed = await bcrypt.hash(password, salt);
    return this.userRepo.update(id, { password: hashed });
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
