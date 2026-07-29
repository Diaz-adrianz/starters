import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseDto } from '../../shared/dto/response.dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Reflector } from '@nestjs/core';
import {
  RES_SUCCESS_METADATA,
  ResSuccessMetadata,
} from '../decorators/res-success.decorator';
import { PaginationResponseDto } from '../../shared/dto/pagination-response.dto';
import { ResourceScopeQueryDto } from '../../shared/dto/resource-scope.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<
  any,
  ResponseDto<any>
> {
  private successMetadata?: ResSuccessMetadata | null;

  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<any>> {
    this.successMetadata = this.reflector.get<ResSuccessMetadata>(
      RES_SUCCESS_METADATA,
      context.getHandler(),
    );

    return next
      .handle()
      .pipe(map((data) => this.responseHandler(data, context)));
  }

  responseHandler(data: unknown, context: ExecutionContext): ResponseDto<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();
    const statusCode = response.statusCode;
    const message = this.successMetadata?.message || 'success';

    return {
      statusCode,
      message,
      data: this.resolveData(data, request),
    };
  }

  private resolveData(data: unknown, request: Request) {
    if (data instanceof DeleteResult || data instanceof UpdateResult) {
      if (!data.affected && !this.successMetadata?.allowNoAffected)
        throw new NotFoundException('Entry not found');
      return { affected: data.affected };
    }

    if (data instanceof InsertResult) {
      if (!data.identifiers.length && !this.successMetadata?.allowNoAffected)
        throw new UnprocessableEntityException('Entry could not be created');
      return { affected: data.identifiers.length };
    }

    if (
      Array.isArray(data) &&
      data.length === 2 &&
      Array.isArray(data[0]) &&
      typeof data[1] === 'number'
    ) {
      const [items, total] = data as [unknown[], number];
      const query = plainToInstance(ResourceScopeQueryDto, request.query || {});

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
