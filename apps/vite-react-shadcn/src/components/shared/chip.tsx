'use client';

import * as React from 'react';
import { RiCheckLine } from '@remixicon/react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

type ChipGroupContextValue = {
  type: 'single' | 'multiple';
  value: string[];
  invalid?: boolean;
  disabled?: boolean;
  toggle: (value: string) => void;
};

const ChipGroupContext = React.createContext<ChipGroupContextValue | null>(
  null
);

function useChipGroup() {
  const ctx = React.useContext(ChipGroupContext);
  if (!ctx) throw new Error('<Chip> must be used within <ChipGroup>');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Controllable state                                                        */
/* -------------------------------------------------------------------------- */

function useControllableValue(
  value: string[] | undefined,
  defaultValue: string[],
  onChange?: (next: string[]) => void
) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const set = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [current, set] as const;
}

const toArray = (v?: string | string[]) =>
  v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : [];

/* -------------------------------------------------------------------------- */
/*  ChipGroup                                                                 */
/* -------------------------------------------------------------------------- */

type ChipGroupBaseProps = Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  invalid?: boolean;
  disabled?: boolean;
};

type ChipGroupSingleProps = ChipGroupBaseProps & {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChanged?: (value: string) => void;
};

type ChipGroupMultipleProps = ChipGroupBaseProps & {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChanged?: (value: string[]) => void;
};

type ChipGroupProps = ChipGroupSingleProps | ChipGroupMultipleProps;

function ChipGroup({
  type = 'single',
  value,
  defaultValue,
  onValueChanged,
  invalid,
  disabled,
  className,
  ...props
}: ChipGroupProps) {
  const [current, setCurrent] = useControllableValue(
    toArray(value),
    toArray(defaultValue) ?? [],
    (next) => {
      if (type === 'multiple') {
        (onValueChanged as ((v: string[]) => void) | undefined)?.(next);
      } else {
        (onValueChanged as ((v: string) => void) | undefined)?.(next[0] ?? '');
      }
    }
  );

  const toggle = React.useCallback(
    (chipValue: string) => {
      if (type === 'single') {
        if (current[0] === chipValue) return;
        setCurrent([chipValue]);
        return;
      }
      setCurrent(
        current.includes(chipValue)
          ? current.filter((v) => v !== chipValue)
          : [...current, chipValue]
      );
    },
    [type, current, setCurrent]
  );

  const ctx = React.useMemo<ChipGroupContextValue>(
    () => ({ type, value: current, invalid, disabled, toggle }),
    [type, current, invalid, disabled, toggle]
  );

  return (
    <ChipGroupContext.Provider value={ctx}>
      <div
        data-slot="chip-group"
        data-invalid={invalid ? 'true' : undefined}
        role={type === 'single' ? 'radiogroup' : 'group'}
        aria-invalid={invalid || undefined}
        className={cn('flex flex-wrap items-center gap-2', className)}
        {...props}
      />
    </ChipGroupContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chip                                                                      */
/* -------------------------------------------------------------------------- */

type ChipProps = Omit<
  React.ComponentProps<typeof Button>,
  'value' | 'variant' | 'size' | 'role'
> & {
  value: string;
};

function Chip({ value, className, children, onClick, ...props }: ChipProps) {
  const group = useChipGroup();
  const checked = group.value.includes(value);
  const isMultiple = group.type === 'multiple';

  return (
    <Button
      {...props}
      type="button"
      variant={checked ? 'default' : 'outline'}
      size="sm"
      data-slot="chip"
      data-state={checked ? 'checked' : 'unchecked'}
      data-invalid={group.invalid ? 'true' : undefined}
      role={isMultiple ? 'checkbox' : 'radio'}
      aria-checked={checked}
      aria-invalid={group.invalid || undefined}
      disabled={group.disabled || props.disabled}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) group.toggle(value);
      }}
      className={cn(
        'rounded-full',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary',
        'data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive!',
        'data-[invalid=true]:focus-visible:border-destructive data-[invalid=true]:focus-visible:ring-destructive/20 dark:data-[invalid=true]:focus-visible:ring-destructive/40',
        'data-[invalid=true]:data-[state=checked]:bg-destructive/10',
        className
      )}
    >
      {isMultiple && checked && <RiCheckLine className="size-4" aria-hidden />}
      {children}
    </Button>
  );
}

export { Chip, ChipGroup };
export type { ChipProps, ChipGroupProps };
