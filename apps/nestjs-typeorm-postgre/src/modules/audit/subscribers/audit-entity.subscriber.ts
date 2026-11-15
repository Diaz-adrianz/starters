import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  DataSource,
  EntityMetadata,
  EntitySubscriberInterface,
  InsertEvent,
  ObjectLiteral,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { DatabaseKeys } from '../../../database/database-keys.constant';
import { EventService } from '../../../infra/event/event.service';
import { ActivityOutcome } from '../enums/activity-outcome.enum';
import { LoggerService } from '../../../infra/logger/logger.service';

const AUDIT_BLACKLIST = new Set<string>([
  'audit.Activity',
  'auth.Session',
  'identity.Token',
  'notification.Message',
  'notification.PushToken',
]);

type AuditAction = 'create' | 'update' | 'archive' | 'restore' | 'delete';
type Plain = Record<string, unknown>;

@Injectable()
export class AuditEntitySubscriber implements EntitySubscriberInterface {
  private name = 'audit/' + this.constructor.name;

  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource,
    private event: EventService,
    private logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  afterInsert(e: InsertEvent<ObjectLiteral>) {
    if (this.skip(e.metadata)) return;
    this.audit(e.metadata, 'create', this.idOf(e.metadata, e.entity), {
      after: this.toPlain(e.metadata, e.entity),
    });
  }

  afterUpdate(e: UpdateEvent<ObjectLiteral>) {
    if (this.skip(e.metadata)) return;

    const dbPlain = this.toPlain(e.metadata, e.databaseEntity);
    const newPlain = this.toPlain(e.metadata, e.entity);
    if (!newPlain) return;

    const before: Plain = {};
    const after: Plain = {};

    for (const col of e.updatedColumns) {
      if (this.isAuto(col)) continue;
      const key = col.propertyName;
      if (!(key in newPlain)) continue;
      before[key] = dbPlain?.[key];
      after[key] = newPlain[key];
    }

    if (!Object.keys(after).length) return;

    const id =
      this.idOf(e.metadata, e.entity) ??
      this.idOf(e.metadata, e.databaseEntity);
    this.audit(e.metadata, 'update', id, { before, after });
  }

  afterSoftRemove(e: SoftRemoveEvent<ObjectLiteral>) {
    if (this.skip(e.metadata)) return;
    const src = e.databaseEntity ?? e.entity;
    this.audit(
      e.metadata,
      'archive',
      this.idOf(e.metadata, src, e.entityId),
      {},
    );
  }

  afterRecover(e: RecoverEvent<ObjectLiteral>) {
    if (this.skip(e.metadata)) return;
    this.audit(
      e.metadata,
      'restore',
      this.idOf(e.metadata, e.entity, e.entityId),
      {},
    );
  }

  afterRemove(e: RemoveEvent<ObjectLiteral>) {
    if (this.skip(e.metadata)) return;
    this.audit(
      e.metadata,
      'delete',
      this.idOf(e.metadata, e.databaseEntity ?? e.entity, e.entityId),
      { before: this.toPlain(e.metadata, e.databaseEntity ?? e.entity) },
    );
  }

  private skip(meta: EntityMetadata) {
    return AUDIT_BLACKLIST.has(`${meta.schema}.${meta.name}`);
  }

  private isAuto(col: {
    isCreateDate: boolean;
    isUpdateDate: boolean;
    isDeleteDate: boolean;
    isVersion: boolean;
  }) {
    return (
      col.isCreateDate || col.isUpdateDate || col.isDeleteDate || col.isVersion
    );
  }

  private toPlain(meta: EntityMetadata, entity?: ObjectLiteral | null) {
    if (!entity) return undefined;

    const target = meta.target;
    const instance =
      typeof target === 'function' && !(entity instanceof target)
        ? plainToInstance(target as new () => object, entity)
        : entity;

    const plain = instanceToPlain(instance) as Plain;

    for (const col of meta.columns)
      if (this.isAuto(col)) delete plain[col.propertyName];

    return plain;
  }

  private idOf(
    meta: EntityMetadata,
    entity?: ObjectLiteral | null,
    fallback?: unknown,
  ): string | undefined {
    const raw = entity ? meta.getEntityIdMap(entity) : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value =
      raw && Object.keys(raw).length
        ? meta.hasMultiplePrimaryKeys
          ? JSON.stringify(raw)
          : Object.values(raw)[0]
        : fallback;

    if (value == null) return undefined;
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  private audit(
    meta: EntityMetadata,
    action: AuditAction,
    resourceId: string | undefined,
    data: { before?: Plain; after?: Plain },
  ) {
    try {
      this.event.emitAuditActivityLog({
        module: meta.schema ?? 'app',
        action,
        resourceType: meta.name,
        resourceId: resourceId ?? null,
        outcome: ActivityOutcome.SUCCESS,
        metadata: data,
      });
      this.logger.debug(
        `Audit entity succeed: ${meta.schema}.${meta.name}.${action}`,
        this.name,
      );
    } catch (error) {
      this.logger.error(
        `Audit entity failed: ${meta.schema}.${meta.name}.${action}`,
        error,
        this.name,
      );
    }
  }
}
