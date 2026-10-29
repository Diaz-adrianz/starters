import { format } from 'date-fns';
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

function DatePickerSingle({
  value,
  onValueChange,
  type = 'date',
  placeholder = 'Select date',
  disabled,
}: {
  value?: Date;
  onValueChange?: (value: Date | undefined) => void;
  type?: 'date' | 'datetime';
  placeholder?: string;
  disabled?: boolean;
}) {
  const [internalValue, setInternalValue] = useState<Date | undefined>();

  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selectedDate = isControlled ? value : internalValue;

  const updateDate = (date: Date | undefined) => {
    if (!isControlled) {
      setInternalValue(date);
    }

    onValueChange?.(date);
  };

  const updateTime = (time: string) => {
    if (!selectedDate) return;

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
            format(
              selectedDate,
              type === 'datetime' ? 'dd MMM yyyy hh:mm a' : 'dd MMM yyyy'
            )
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
            if (!date) {
              updateDate(undefined);
              return;
            }

            if (selectedDate && type === 'datetime')
              date.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds(),
                selectedDate.getMilliseconds()
              );

            updateDate(date);

            if (type === 'date') setOpen(false);
          }}
        />

        {type === 'datetime' && (
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
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DatePickerSingle };
