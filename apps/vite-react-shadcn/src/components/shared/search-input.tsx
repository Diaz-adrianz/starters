import { useEffect, useState, type ComponentProps } from 'react';
import { RiCloseLine, RiLoaderLine, RiSearchLine } from '@remixicon/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';

function SearchInput({
  placeholder = 'Search...',
  defaultValue = '',
  debounceMs = 300,
  isLoading,
  resultsCount,
  onChange,
  ...props
}: Omit<ComponentProps<typeof InputGroup>, 'defaultValue' | 'onChange'> & {
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
  isLoading?: boolean;
  resultsCount?: number;
  onChange: (value: string) => void;
}) {
  const [search, setSearch] = useState(defaultValue);
  const debounced = useDebounce(search.trim(), debounceMs);

  useEffect(() => {
    onChange(debounced);
  }, [debounced]);

  return (
    <InputGroup {...props}>
      <InputGroupInput
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setSearch('')}
      />
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>
      {isLoading ? (
        <InputGroupAddon align="inline-end">
          <RiLoaderLine className="animate-spin" />
        </InputGroupAddon>
      ) : search ? (
        <InputGroupAddon align="inline-end">
          {resultsCount !== undefined && <span>{resultsCount} results</span>}
          <InputGroupButton size="icon-xs" onClick={() => setSearch('')}>
            <RiCloseLine />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

export { SearchInput };
