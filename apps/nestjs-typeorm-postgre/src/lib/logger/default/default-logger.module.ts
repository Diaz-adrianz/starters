import { Global, Module } from '@nestjs/common';
import { DefaultLoggerService } from './default-logger.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {
  LOGGER_CONFIG_KEY,
  loggerConfig,
  LoggerConfig,
} from '../../../config/logger.config';
import { ConfigModule } from '@nestjs/config';

const { combine, timestamp, printf, colorize, errors } = format;

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule.forFeature(loggerConfig)],
      inject: [LOGGER_CONFIG_KEY],
      useFactory: (loggerConfig: LoggerConfig) => ({
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          colorize(),
          printf(({ level, message, timestamp, context, stack }) => {
            return `${timestamp} [${context ?? 'App'}] ${level}: ${message} ${stack ? `- ${stack}` : ''}`;
          }),
        ),
        transports: [
          new transports.Console(),
          new DailyRotateFile({
            filename: loggerConfig.default.path + '%DATE%.log',
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
  providers: [DefaultLoggerService],
  exports: [DefaultLoggerService],
})
export class DefaultLoggerModule {}
