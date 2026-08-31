import { Module } from '@nestjs/common';
import { DefaultFirebaseService } from './default-firebase.service';
import { ConfigModule } from '@nestjs/config';
import { firebaseConfig } from '../../../config/firebase.config';

@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  providers: [DefaultFirebaseService],
  exports: [DefaultFirebaseService],
})
export class DefaultFirebaseModule {}
