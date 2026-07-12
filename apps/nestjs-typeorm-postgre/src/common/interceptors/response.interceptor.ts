import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ResponseDto } from '../../shared/dto/response.dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { Reflector } from '@nestjs/core';
import {
  RESPONSE_SUCCESS_METADATA,
  ResponseSuccessMetadata,
} from '../decorators/response-success.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<
  any,
  ResponseDto<any>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<any>> {
    return next
      .handle()
      .pipe(map((data) => this.responseHandler(data, context)));
  }

  responseHandler(res: unknown, context: ExecutionContext): ResponseDto<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get<ResponseSuccessMetadata>(
        RESPONSE_SUCCESS_METADATA,
        context.getHandler(),
      )?.message || 'success';

    return {
      statusCode,
      message,
      data: this.resolveData(res),
    };
  }

  private resolveData(res: unknown): any {
    if (
      res instanceof InsertResult ||
      res instanceof UpdateResult ||
      res instanceof DeleteResult
    ) {
      if (
        (res instanceof DeleteResult || res instanceof UpdateResult) &&
        !res.affected
      ) {
        throw new NotFoundException('Entry not found');
      }
      return undefined;
    }

    if (
      Array.isArray(res) &&
      res.length === 2 &&
      Array.isArray(res[0]) &&
      typeof res[1] === 'number'
    ) {
      const [items, total] = res as [unknown[], number];

      return {
        page: 1,
        limit: 10,
        totalItems: total,
        totalPages: 1,
        items: instanceToPlain(items),
      } as PaginationDto;
    }

    return instanceToPlain(res);
  }
}
