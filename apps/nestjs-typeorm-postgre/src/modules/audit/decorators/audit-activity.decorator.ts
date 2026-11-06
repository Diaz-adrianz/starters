import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import { Store } from '../../../infra/store/store.interface';

export type AuditActivityCtx = { req: Request; res: any };

export type AuditActivityMetadata = {
  module?: string;
  action?: string;
  targetType?: string;
  targetId?: (c: AuditActivityCtx) => string | string[] | null | undefined;
  targetName?: (c: AuditActivityCtx) => string | null | undefined;
  actor?: (
    c: AuditActivityCtx,
  ) => Pick<NonNullable<Store['actor']>, 'id' | 'name' | 'type'> | null;
  redact?: string[];
};

export const AUDIT_ACTIVITY_METADATA_KEY = 'AuditActivity';

export const AuditActivity = (options: AuditActivityMetadata = {}) =>
  SetMetadata(AUDIT_ACTIVITY_METADATA_KEY, options);
