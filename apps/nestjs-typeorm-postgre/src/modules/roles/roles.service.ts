import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { FindAllOptions } from '../../shared/classes/findall-query.class';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findAll(queryOptions: FindAllOptions) {
    return this.roleRepo.findAndCount(queryOptions);
  }

  findOne(id: string) {
    return this.roleRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.roleRepo.update({ id }, updateRoleDto);
  }

  softDelete(id: string) {
    return this.roleRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.roleRepo.restore({ id });
  }

  delete(id: string) {
    return this.roleRepo.delete({ id });
  }
}
