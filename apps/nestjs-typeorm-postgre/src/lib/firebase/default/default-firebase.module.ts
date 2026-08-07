import { Global, Module } from '@nestjs/common';
import { DefaultFirebaseService } from './default-firebase.service';

@Global()
@Module({
  providers: [DefaultFirebaseService],
  exports: [DefaultFirebaseService],
})
export class DefaultFirebaseModule {}
