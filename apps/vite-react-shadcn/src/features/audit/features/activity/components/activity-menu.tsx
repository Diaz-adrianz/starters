import { RiExpandDiagonalLine } from '@remixicon/react';
import type { Activity } from '../types/activity.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type ActivityMenuItem = Pick<Activity, 'id'>;

function ActivityMenu({
  activity,
  actions,
}: {
  activity: ActivityMenuItem;
  actions?: {
    read?: string | ((activity: ActivityMenuItem) => void);
  };
}) {
  if (!actions) return null;
  const { read } = actions;

  return (
    <>
      {read && (
        <ResourceMenuButton
          subject="audit:activity"
          action="read"
          label="View"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={
            typeof read === 'function' ? () => read(activity) : undefined
          }
        />
      )}
    </>
  );
}

export { ActivityMenu };
