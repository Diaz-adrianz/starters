import type { RemixiconComponentType } from '@remixicon/react';
import { cn } from 'cn';
import { WithTooltip } from './with-tooltip';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Can } from '@casl/react';

function ResourceMenuButton({
  action,
  subject,
  Icon,
  label,
  destructive,
  to,
  onClick,
}: {
  action: string;
  subject: string;
  Icon: RemixiconComponentType;
  label: string;
  destructive?: boolean;
  to?: string;
  onClick?: () => void;
}) {
  const className = cn(
    destructive && 'text-destructive hover:text-destructive'
  );
  return (
    <Can I={action} a={subject}>
      <WithTooltip text={label}>
        {to ? (
          <Button size="icon" variant="ghost" className={className} asChild>
            <Link to={to}>
              <Icon />
            </Link>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className={className}
            onClick={onClick}
          >
            <Icon />
          </Button>
        )}
      </WithTooltip>
    </Can>
  );
}

export { ResourceMenuButton };
