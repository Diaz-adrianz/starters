import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import {
  createContext,
  Fragment,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import type { Session } from '../types/session.type';
import { useSessions } from '../api/session.query';
import { useResourceQuery } from '@/hooks/use-resource-query';

// ======================================
// Context
// --------------------------------------
type SessionListContextProps = {
  sessions: Session[];
  isLoading: boolean;
};

const SessionListContext = createContext<SessionListContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionList = () => {
  const context = useContext(SessionListContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
};

// ======================================
// Provider
// --------------------------------------
export const SessionList = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const { params } = useResourceQuery({
    page: 1,
    limit: 10,
    order: { lastUsedAt: 'desc' },
  });
  const { data, isLoading } = useSessions(params);

  return (
    <SessionListContext.Provider
      value={{ sessions: data?.items ?? [], isLoading }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </SessionListContext.Provider>
  );
};

// ======================================
// Content
// --------------------------------------
export const SessionListItemGroup = ({
  children,
  separator,
  ...props
}: Omit<ComponentProps<typeof ItemGroup>, 'children'> & {
  children: (session: Session) => ReactNode;
  separator?: boolean;
}) => {
  const { sessions } = useSessionList();

  return (
    <ItemGroup {...props}>
      {sessions.map((s, i) => {
        return (
          <Fragment key={`SessionListItemGroup${i}`}>
            {children(s)}
            {separator && i < sessions.length - 1 && <ItemSeparator />}
          </Fragment>
        );
      })}
    </ItemGroup>
  );
};
