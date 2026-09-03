import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { HeaderKeys } from './shared/constants/header-keys.constant';
import { APP_CONFIG_KEY, AppConfig } from './config/app.config';
import { LoggerService } from './infra/logger/logger.service';
import { CorsOptions } from 'cors';

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

  // Cookie
  // ---------------------------------
  app.use(cookieParser());

  // Cors
  // ---------------------------------
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || appConfig.clientOrigins.includes(origin))
        callback(null, true);
      else callback(new Error(`Blocked CORS request from origin "${origin}"`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: Object.values(HeaderKeys),
  };
  app.enableCors(corsOptions);

  await app.listen(appConfig.port);
}

void bootstrap();
