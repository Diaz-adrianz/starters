import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../access-control/entities/user-role.entity';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole]), DefaultStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
