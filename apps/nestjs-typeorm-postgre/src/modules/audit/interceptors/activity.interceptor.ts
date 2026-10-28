import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import {
  AUDIT_ACTIVITY_METADATA_KEY,
  AuditActivityCtx,
  AuditActivityMetadata,
} from '../decorators/audit-activity.decorator';
import { Request } from 'express';
import { ActivityStatus } from '../enums/activity-status.enum';
import { StoreService } from '../../../infra/store/store.service';
import { EventService } from '../../../infra/event/event.service';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../../../infra/logger/logger.service';
import { Store } from '../../../infra/store/store.interface';
import { ActorType } from '../enums/actor-type.enum';

const SENSITIVE_FIELDS = [
  'password',
  'token',
  'refreshToken',
  'secret',
] as const;

const ActorTypeMap: Record<NonNullable<Store['actor']>['type'], ActorType> = {
  user: ActorType.USER,
};

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private logger: LoggerService,
    private store: StoreService,
    private event: EventService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const metadata = this.reflector.get<AuditActivityMetadata | undefined>(
      AUDIT_ACTIVITY_METADATA_KEY,
      ctx.getHandler(),
    );

    const req = ctx.switchToHttp().getRequest<Request>();

    if (!metadata) return next.handle();

    return next.handle().pipe(
      tap({
        next: (res) => this.emit(metadata, ActivityStatus.SUCCESS, req, res),
        error: (err) =>
          this.emit(metadata, ActivityStatus.FAILURE, req, null, err),
      }),
    );
  }

  private emit(
    metadata: AuditActivityMetadata,
    status: ActivityStatus,
    req: Request,
    res: any,
    err?: unknown,
  ) {
    try {
      const activityCtx: AuditActivityCtx = { req, res };

      const permission = this.store.get('permission')?.key,
        permissionParts = permission?.split(':') ?? [];

      const module = metadata.module ?? permissionParts.at(0),
        resource = metadata.targetType ?? permissionParts.at(1),
        action = metadata.action ?? permissionParts.at(2);

      if (!action || !module) {
        this.logger.warn(
          `No action/module for ${req.method} ${req.path}. Add @AuditActivity({ module, action }).`,
          this.constructor.name,
        );
        return;
      }

      const storeActor = this.store.get('actor'),
        actor = storeActor ?? metadata.actor?.(activityCtx);

      if (!actor) {
        this.logger.warn(
          `No actor for ${req.method} ${req.path}. Add @AuditActivity({ actor }).`,
          this.constructor.name,
        );
        return;
      }

      const device = this.store.get('device');

      this.event.emit('audit.activity.create', {
        actorType: ActorTypeMap[actor.type],
        actorId: actor?.id,
        actorName: actor?.name,
        module,
        action,
        status,
        targetType: resource,
        targetId: this.resolveReqParams(
          metadata.targetId?.(activityCtx) ?? req.params.id,
        ),
        targetName: metadata.targetName?.(activityCtx),
        requestId: this.store.get('requestId'),
        context: {
          path: req.path,
          ip: device?.ipAddress,
          userAgent: device?.userAgent,
        },
        changes:
          req.body && Object.keys(req.body).length
            ? { after: this.redact(req.body, metadata.redact) }
            : undefined,
        meta: err ? { error: (err as Error).message } : undefined,
      });
    } catch (e) {
      this.logger.warn(`Failed to audit activity`, e, this.constructor.name);
    }
  }

  private redact(body: Record<string, any>, extra: string[] = []) {
    return Object.fromEntries(
      Object.entries(body).map(([k, v]) =>
        [...SENSITIVE_FIELDS, ...extra].includes(k)
          ? [k, '*'.repeat(String(v).length)]
          : [k, v],
      ),
    );
  }

  private resolveReqParams(v: string | string[] | undefined | null) {
    return Array.isArray(v) ? v.join('/') : (v ?? null);
  }
}
