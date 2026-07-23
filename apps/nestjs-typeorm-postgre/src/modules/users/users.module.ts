import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole]), DefaultStorageModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
