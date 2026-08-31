import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import {
  LOGGER_CONFIG_KEY,
  LoggerConfig,
  loggerConfig,
} from '../../config/logger.config';
import { APP_CONFIG_KEY, AppConfig, appConfig } from '../../config/app.config';

const { combine, timestamp, printf, colorize, errors, json } = format;

const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize(),
  printf(({ level, message, timestamp, context, requestId }) => {
    return `${timestamp} [${context}]${requestId ? `[${requestId}]` : ''} ${level}: ${message}`;
  }),
);

const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json(),
);

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(appConfig),
        ConfigModule.forFeature(loggerConfig),
      ],
      inject: [APP_CONFIG_KEY, LOGGER_CONFIG_KEY],
      useFactory: (appConfig: AppConfig, loggerConfig: LoggerConfig) => ({
        transports: [
          // Levels: debug + verbose + info + warn + error (dev) | info + warn + error (prod)
          new transports.Console({
            format: consoleFormat,
            level: appConfig.mode === 'production' ? 'info' : 'debug',
          }),
          // Levels: warn + error — disabled on dev
          ...(appConfig.mode === 'production'
            ? [
                new DailyRotateFile({
                  format: fileFormat,
                  filename: loggerConfig.path + '%DATE%.log',
                  level: 'warn',
                  datePattern: 'YYYY-MM-DD',
                  zippedArchive: false,
                  maxFiles: '30d',
                  maxSize: '20m',
                }),
              ]
            : []),
        ],
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
