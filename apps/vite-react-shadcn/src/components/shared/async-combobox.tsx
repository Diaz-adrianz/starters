import { Fragment, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

type AsyncComboboxProps<T> = {
  queryKey: readonly unknown[];
  loadItems: (search: string) => Promise<T[]>;
  getItemKey: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  renderItem?: (item: T) => ReactNode;
  placeholder?: string;
  emptyText?: ReactNode;
  loadingText?: ReactNode;
  debounceMs?: number;
  minSearchLength?: number;
  max?: number;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  className?: string;
  onBlur?: () => void;
  container?: HTMLElement | null;
};

function AsyncCombobox<T>({
  queryKey,
  loadItems,
  getItemKey,
  getItemLabel,
  value,
  defaultValue,
  onValueChange,
  renderItem,
  placeholder = 'Search...',
  emptyText = 'No results found.',
  loadingText = 'Loading...',
  debounceMs = 300,
  minSearchLength = 0,
  max,
  disabled,
  invalid,
  id,
  name,
  className,
  onBlur,
  container,
}: AsyncComboboxProps<T>) {
  const anchor = useComboboxAnchor();

  const [internalValue, setInternalValue] = useState<T[]>(defaultValue ?? []);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, debounceMs);

  const { data = [], isFetching } = useQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: () => loadItems(debouncedSearch),
    enabled: debouncedSearch.length >= minSearchLength,
    staleTime: 30 * 1000,
  });

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const isSingle = max === 1;
  const isFull = max !== undefined && !isSingle && selectedValue.length >= max;

  const updateValue = (next: T[]) => {
    if (isSingle) next = next.slice(-1);
    else if (max !== undefined && next.length > max) return;
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <Combobox
      multiple
      items={data}
      filter={null}
      autoHighlight
      disabled={disabled}
      name={name}
      value={selectedValue}
      onValueChange={updateValue}
      onInputValueChange={(v) => setSearch(v)}
      itemToStringLabel={getItemLabel}
      isItemEqualToValue={(a: T, b: T) => getItemKey(a) === getItemKey(b)}
    >
      <ComboboxChips ref={anchor} className={className}>
        <ComboboxValue>
          {(values: T[]) => (
            <Fragment>
              {values.map((v) => (
                <ComboboxChip key={getItemKey(v)}>
                  {getItemLabel(v)}
                </ComboboxChip>
              ))}
              {!isFull && (
                <ComboboxChipsInput
                  id={id}
                  placeholder={values.length ? undefined : placeholder}
                  aria-invalid={invalid}
                  onBlur={onBlur}
                />
              )}
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor} container={container}>
        <ComboboxEmpty>{isFetching ? loadingText : emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem
              key={getItemKey(item)}
              value={item}
              disabled={
                isFull &&
                !selectedValue.some((v) => getItemKey(v) === getItemKey(item))
              }
            >
              {renderItem ? renderItem(item) : getItemLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export { AsyncCombobox };
export type { AsyncComboboxProps };
