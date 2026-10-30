import { RiDeleteBack2Line, RiProhibitedLine } from '@remixicon/react';
import type { Session } from '../types/session.type';
import { ResourceMenuButton } from '@/components/shared/resource-menu';

type SessionMenuItem = Pick<Session, 'id' | 'deviceLabel'>;

function SessionMenu({
  session,
  actions,
}: {
  session: SessionMenuItem;
  actions?: {
    revoke?: (session: SessionMenuItem) => void;
    delete?: (session: SessionMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { revoke, delete: del } = actions;

  return (
    <>
      {revoke && (
        <ResourceMenuButton
          subject="auth:session"
          action="revoke"
          label="Terminate"
          Icon={RiProhibitedLine}
          destructive
          onClick={() => revoke(session)}
        />
      )}
      {del && (
        <ResourceMenuButton
          subject="auth:session"
          action="delete"
          label="Delete"
          Icon={RiDeleteBack2Line}
          destructive
          onClick={() => del(session)}
        />
      )}
    </>
  );
}

export { SessionMenu };
