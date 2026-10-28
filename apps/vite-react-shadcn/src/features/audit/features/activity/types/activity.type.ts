export type ActivityActor = 'user';

export type ActivityStatus = 'success' | 'failure' | 'denied';

export type Activity = {
  id: string;
  actorType: ActivityActor;
  actorId: string | null;
  actorName: string | null;
  module: string;
  action: string;
  status: ActivityStatus;
  targetType: string | null;
  targetId: string | null;
  targetName: string | null;
  requestId: string | null;
  context: { path?: string; ip?: string; userAgent?: string } | null;
  changes: { before?: any; after?: any } | null;
  meta: Record<string, any> | null;
  createdAt: Date;
};
