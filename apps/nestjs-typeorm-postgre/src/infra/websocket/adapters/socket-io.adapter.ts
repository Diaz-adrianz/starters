import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppConfig } from '../../../config/app.config';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private appConfig: AppConfig,
  ) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    options.cors = { origin: this.appConfig.clientOrigins, credentials: true };
    return super.createIOServer(port, options);
  }
}
