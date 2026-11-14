export type ActivityOutcome = 'success' | 'failure';

export type Activity = {
  id: string;
  occuredAt: string;
  loggedAt: string;
  requestId: string | null;
  module: string;
  context: Record<string, any> | null;
  actorType: string;
  actorId: string | null;
  actorName: string | null;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  outcome: ActivityOutcome;
  metadata: Record<string, any> | null;
};
