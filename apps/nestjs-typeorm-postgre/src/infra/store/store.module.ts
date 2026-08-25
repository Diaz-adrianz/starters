import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { StoreService } from './store.service';

@Global()
@Module({
  imports: [ClsModule.forRoot({ middleware: { mount: true } })],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
