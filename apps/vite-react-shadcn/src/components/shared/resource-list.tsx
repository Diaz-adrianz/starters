import type { ComponentProps } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

function ResourceListTrashFilter({
  value,
  onValueChange,
  ...props
}: Omit<ComponentProps<typeof Tabs>, 'value' | 'onValueChange'> & {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}) {
  return (
    <Tabs
      {...props}
      value={value ? 'trash' : 'active'}
      onValueChange={(v) => onValueChange?.(v === 'trash')}
    >
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger
          value="trash"
          className="data-[state=active]:text-destructive!"
        >
          Trash
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export { ResourceListTrashFilter };
