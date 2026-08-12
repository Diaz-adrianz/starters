import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserRole } from '../access-control/entities/user-role.entity';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';

@Module({
  imports: [DefaultDatabaseModule.forFeature([User, UserRole])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
