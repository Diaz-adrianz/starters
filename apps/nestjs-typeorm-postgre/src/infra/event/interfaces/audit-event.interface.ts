import { CreateActivityDto } from '../../../modules/audit/resources/activity/dto/create-activity.dto';

export const AuditEventName = {
  ACTIVITY_CREATE: 'audit.activity.create',
} as const;

export interface AuditEventPayload {
  [AuditEventName.ACTIVITY_CREATE]: CreateActivityDto;
}
