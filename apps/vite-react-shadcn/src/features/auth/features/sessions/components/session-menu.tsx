import {
  RiDeleteBack2Line,
  RiExpandDiagonalLine,
  RiProhibitedLine,
} from '@remixicon/react';
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
    read?: string | ((session: SessionMenuItem) => void);
    delete?: (session: SessionMenuItem) => void;
  };
}) {
  if (!actions) return null;
  const { revoke, read, delete: del } = actions;

  return (
    <>
      {read && (
        <ResourceMenuButton
          subject="auth:session"
          action="read"
          label="View"
          Icon={RiExpandDiagonalLine}
          to={typeof read === 'string' ? read : undefined}
          onClick={typeof read === 'function' ? () => read(session) : undefined}
        />
      )}
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
