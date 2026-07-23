import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const configService: ConfigService<EnvConfig> = app.get(ConfigService);

  await app.listen(configService.getOrThrow('port'));
}

void bootstrap();
