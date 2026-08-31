import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../../config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(authConfig), JwtModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
