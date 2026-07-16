import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

const { combine, timestamp, printf, colorize, errors } = format;

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
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
            filename:
              configService.getOrThrow('logger.path', { infer: true }) +
              '%DATE%.log',
            level: 'error',
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
