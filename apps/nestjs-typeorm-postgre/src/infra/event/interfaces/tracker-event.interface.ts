import { ActivityLevel } from '../../../modules/tracker/enums/activity-level.enum';
import { ActorType } from '../../../modules/tracker/enums/actor-type.enum';

export const TrackerEventName = {
  TRACKER_ACTIVITY_SAVE: 'tracker.activity.save',
} as const;

export interface TrackerEventPayload {
  [TrackerEventName.TRACKER_ACTIVITY_SAVE]: {
    level: ActivityLevel;
    module: string;
    description: string | null;
    actorType: ActorType;
    actorId: string | null;
    actorName: string | null;
    targetType: string | null;
    targetId: string | null;
    targetName: string | null;
    action: string;
    metadata: Record<string, any> | null;
  };
}
