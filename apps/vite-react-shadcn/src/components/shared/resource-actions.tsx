import { useAbility } from '@casl/react';
import { RiMore2Line, type RemixiconComponentType } from '@remixicon/react';
import { WithTooltip } from './with-tooltip';
import { cn } from 'cn';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type ActionConfig = {
  icon: RemixiconComponentType;
  label: string;
  can?: { i: string; a: string };
  variant?: 'default' | 'destructive';
};

type ActionHandler = string | (() => void);

type ActionItem<K extends string> = Omit<ActionConfig, 'can'> & {
  key: K;
  handler: ActionHandler;
};

type ResourceActionsProps<K extends string> = {
  actions: Record<K, ActionConfig>;
  handlers?: Partial<Record<K, ActionHandler>>;
  collapsed?: K[];
};

function ResourceActions<K extends string>({
  actions,
  handlers,
  collapsed,
}: ResourceActionsProps<K>) {
  const ability = useAbility();

  const items = (Object.entries(actions) as [K, ActionConfig][]).reduce<{
    shown: ActionItem<K>[];
    collapsed: ActionItem<K>[];
  }>(
    (acc, [key, { can, ...rest }]) => {
      if ((can && !ability.can(can.i, can.a)) || !handlers?.[key]) return acc;

      const item: ActionItem<K> = {
        ...rest,
        key,
        handler: handlers[key],
      };

      (collapsed?.includes(key) ? acc.collapsed : acc.shown).push(item);
      return acc;
    },
    { shown: [], collapsed: [] }
  );

  return (
    <>
      {items.shown.map((item) => {
        const className = cn(
          item.variant == 'destructive' &&
            'text-destructive hover:text-destructive'
        );

        return (
          <WithTooltip key={item.key} text={item.label}>
            {typeof item.handler === 'string' ? (
              <Button size="icon" variant="ghost" className={className} asChild>
                <Link to={item.handler}>
                  <item.icon />
                </Link>
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className={className}
                onClick={item.handler}
              >
                <item.icon />
              </Button>
            )}
          </WithTooltip>
        );
      })}
      {items.collapsed.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'icon'} variant={'ghost'}>
              <RiMore2Line />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {items.collapsed.map((item) => {
                return typeof item.handler === 'string' ? (
                  <DropdownMenuItem
                    key={item.key}
                    variant={item.variant}
                    asChild
                  >
                    <Link to={item.handler}>
                      <item.icon /> {item.label}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    key={item.key}
                    variant={item.variant}
                    onClick={item.handler}
                  >
                    <item.icon /> {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export { ResourceActions };
export type { ResourceActionsProps };
