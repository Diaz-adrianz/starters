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
import { format, parse } from 'date-fns';
import { isValidDateString } from '@/utils/date';

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
    const nextValue = date ? format(date, 'yyyy-MM-dd') : null;

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
            format(selectedDate, 'dd MMM yyyy')
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
            format(selectedDate, 'dd MMM yyyy hh:mm a')
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
              value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
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

export { DatePickerSingle, DatetimePickerSingle };
