import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { HeaderKeys } from './shared/constants/header-keys.contant';
import { APP_CONFIG_KEY, AppConfig } from './config/app.config';
import { LoggerService } from './infra/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule),
    appConfig: AppConfig = app.get(APP_CONFIG_KEY);

  // Allow injection in validation
  // ---------------------------------
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Logger
  // ---------------------------------
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Cors
  // ---------------------------------
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: Object.values(HeaderKeys),
  });

  await app.listen(appConfig.port);
}

void bootstrap();
