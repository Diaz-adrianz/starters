import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';
import { User } from './entities/user.entity';
import { UserController } from './resources/user/user.controller';
import { UserService } from './resources/user/user.service';

@Module({
  imports: [DefaultDatabaseModule.forFeature([User]), DefaultStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class IdentityModule {}
