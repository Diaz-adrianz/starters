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

const { combine, timestamp, printf, colorize, errors } = format;

const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  colorize(),
  printf(({ level, message, timestamp, context, stack }) => {
    return `${timestamp} [${context ?? 'App'}] ${level}: ${message}${stack ? ` - ${stack}` : ''}`;
  }),
);

const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, context, stack }) => {
    return `${timestamp} [${context ?? 'App'}] ${level}: ${message}${stack ? ` - ${stack}` : ''}`;
  }),
);

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule.forFeature(loggerConfig)],
      inject: [LOGGER_CONFIG_KEY],
      useFactory: (loggerConfig: LoggerConfig) => ({
        transports: [
          new transports.Console({ format: consoleFormat }),
          new DailyRotateFile({
            format: fileFormat,
            filename: loggerConfig.path + '%DATE%.log',
            level: 'warn',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '30d',
            maxSize: '20m',
          }),
        ],
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
