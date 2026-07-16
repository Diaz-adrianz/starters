import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseDto } from '../../shared/dto/response.dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Reflector } from '@nestjs/core';
import {
  RESPONSE_SUCCESS_METADATA,
  ResponseSuccessMetadata,
} from '../decorators/response-success.decorator';
import { PaginationResponseDto } from '../../shared/dto/pagination-response.dto';
import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';

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

  responseHandler(data: unknown, context: ExecutionContext): ResponseDto<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get<ResponseSuccessMetadata>(
        RESPONSE_SUCCESS_METADATA,
        context.getHandler(),
      )?.message || 'success';

    return {
      statusCode,
      message,
      data: this.resolveData(data, request),
    };
  }

  private resolveData(data: unknown, request: Request) {
    if (
      data instanceof InsertResult ||
      data instanceof UpdateResult ||
      data instanceof DeleteResult
    ) {
      if (
        (data instanceof DeleteResult || data instanceof UpdateResult) &&
        !data.affected
      ) {
        throw new NotFoundException('Entry not found');
      }
      return undefined;
    }

    if (
      Array.isArray(data) &&
      data.length === 2 &&
      Array.isArray(data[0]) &&
      typeof data[1] === 'number'
    ) {
      const [items, total] = data as [unknown[], number];
      const query = plainToInstance(FindAllQueryDto, request.query || {});

      return new PaginationResponseDto(
        this.toPlain(items) as unknown[],
        total,
        query.page,
        query.limit,
      );
    }

    return this.toPlain(data);
  }

  private toPlain(data: unknown): unknown {
    if (data === null || data === undefined) return data;
    if (typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map((item) => this.toPlain(item));
    return instanceToPlain(data);
  }
}
