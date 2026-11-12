import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { User } from './entities/user.entity';
import { UserController } from './resources/user/user.controller';
import { UserService } from './resources/user/user.service';
import { ProfileService } from './resources/profile/profile.service';
import { ProfileController } from './resources/profile/profile.controller';
import { Profile } from './entities/profile.entity';
import { Token } from './entities/token.entity';
import { TokenService } from './resources/token/token.service';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([User, Profile, Token]),
    DefaultStorageModule,
  ],
  controllers: [UserController, ProfileController, IdentityController],
  providers: [UserService, ProfileService, TokenService, IdentityService],
  exports: [UserService],
})
export class IdentityModule {}
