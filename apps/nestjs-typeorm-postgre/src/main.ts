import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const configService: ConfigService<EnvConfig> = app.get(ConfigService);

  await app.listen(configService.getOrThrow('port'));
}

void bootstrap();
