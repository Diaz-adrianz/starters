import { Module } from '@nestjs/common';
import { DefaultFirebaseService } from './default-firebase.service';

@Module({
  providers: [DefaultFirebaseService],
  exports: [DefaultFirebaseService],
})
export class DefaultFirebaseModule {}
