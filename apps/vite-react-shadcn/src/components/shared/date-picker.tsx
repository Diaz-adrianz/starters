import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { RiCalendar2Line, RiTimeLine } from '@remixicon/react';
import { useState } from 'react';
import { parse } from 'date-fns';
import { formatDate, isValidDateString } from '@/utils/date';
import type { DateRange } from 'react-day-picker';

/* ---------------------------------------------------------------------------- */
/* Date yyyy-MM-dd
/* ---------------------------------------------------------------------------- */
function DatePickerSingle({
  value,
  onValueChange,
  placeholder = 'Select date',
  disabled,
}: {
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectedDate =
    selectedValue && isValidDateString(selectedValue)
      ? parse(selectedValue, 'yyyy-MM-dd', new Date())
      : undefined;

  const updateDate = (date: Date | undefined) => {
    const nextValue = date ? formatDate(date, 'yyyy-MM-dd') : null;

    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal"
        >
          <RiCalendar2Line className="mr-2 size-4" />
          {selectedDate ? (
            formatDate(selectedDate, 'PP')
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          onSelect={(date) => {
            updateDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type DateRangeValue = { from: string | null; to: string | null };

function DatePickerRange({
  value,
  onValueChange,
  placeholder = 'Select date range',
  disabled,
  min,
  max,
  numberOfMonths = 2,
  closeOnComplete = true,
}: {
  value?: DateRangeValue;
  onValueChange?: (value: DateRangeValue) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  numberOfMonths?: number;
  closeOnComplete?: boolean;
}) {
  const [internalValue, setInternalValue] = useState<DateRangeValue>({
    from: null,
    to: null,
  });
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const toDate = (v: string | null) =>
    v && isValidDateString(v) ? parse(v, 'yyyy-MM-dd', new Date()) : undefined;

  const selectedRange: DateRange | undefined = {
    from: toDate(selectedValue.from),
    to: toDate(selectedValue.to),
  };

  const updateRange = (range: DateRange | undefined) => {
    const next: DateRangeValue = {
      from: range?.from ? formatDate(range.from, 'yyyy-MM-dd') : null,
      to: range?.to ? formatDate(range.to, 'yyyy-MM-dd') : null,
    };

    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);

    if (closeOnComplete && next.from && next.to) setOpen(false);
  };

  const fmt = (d: Date) => formatDate(d, 'PP');
  const label = selectedRange.from
    ? selectedRange.to
      ? `${fmt(selectedRange.from)} - ${fmt(selectedRange.to)}`
      : `${fmt(selectedRange.from)} - ...`
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="justify-start text-left font-normal"
        >
          <RiCalendar2Line className="mr-2 size-4 shrink-0" />
          {label ? (
            <span className="truncate">{label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={selectedRange}
          defaultMonth={selectedRange.from}
          numberOfMonths={numberOfMonths}
          captionLayout="dropdown"
          min={min}
          max={max}
          onSelect={updateRange}
        />
        <div className="flex items-center justify-end gap-1 border-t p-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={!selectedRange.from}
            onClick={() => updateRange(undefined)}
          >
            Clear
          </Button>
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------------------------------------------------------------------- */
/* Datetime yyyy-MM-dd hh:mm
/* ---------------------------------------------------------------------------- */
function DatetimePickerSingle({
  value,
  onValueChange,
  placeholder = 'Select date and time',
  disabled,
}: {
  value?: Date | null;
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [internalValue, setInternalValue] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selectedDate = isControlled ? value : internalValue;

  const updateDate = (date: Date | null) => {
    if (!isControlled) setInternalValue(date);
    onValueChange?.(date);
  };

  const updateTime = (time: string) => {
    if (!selectedDate || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return;

    const [hours, minutes] = time.split(':').map(Number);
    const nextDate = new Date(selectedDate);

    nextDate.setHours(hours, minutes, 0, 0);
    updateDate(nextDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal"
        >
          <RiCalendar2Line className="mr-2 size-4" />
          {selectedDate ? (
            formatDate(selectedDate, 'PPp')
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) {
              updateDate(null);
              return;
            }

            if (selectedDate)
              date.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds(),
                selectedDate.getMilliseconds()
              );

            updateDate(date);
          }}
        />

        <div className="border-t p-2">
          <InputGroup>
            <InputGroupInput
              type="time"
              step="60"
              disabled={!selectedDate}
              value={selectedDate ? formatDate(selectedDate, 'p') : ''}
              onChange={(event) => updateTime(event.target.value)}
            />
            <InputGroupAddon>
              <RiTimeLine className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DatePickerSingle, DatePickerRange, DatetimePickerSingle };
export type { DateRangeValue };
