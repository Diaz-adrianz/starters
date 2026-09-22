import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { DefaultStorageModule } from '../../lib/storage/default/default-storage.module';
import { User } from './entities/user.entity';
import { UserController } from './resources/user/user.controller';
import { UserService } from './resources/user/user.service';
import { VerificationToken } from './entities/verification-token.entity';
import { VerificationTokenService } from './resources/verification-token/verification-token.service';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([User, VerificationToken]),
    DefaultStorageModule,
  ],
  controllers: [UserController],
  providers: [UserService, VerificationTokenService],
  exports: [UserService, VerificationTokenService],
})
export class IdentityModule {}
