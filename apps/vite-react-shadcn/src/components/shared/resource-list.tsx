import type { ComponentProps } from 'react';
import { Toggle } from '../ui/toggle';
import { RiDeleteBinFill, RiDeleteBinLine } from '@remixicon/react';

function ResourceListTrashFilter({ ...props }: ComponentProps<typeof Toggle>) {
  return (
    <Toggle
      {...props}
      size={props.pressed ? 'default' : 'icon'}
      className="data-[state=on]:animate-pulse data-[state=on]:bg-destructive/15 data-[state=on]:text-destructive"
    >
      {props.pressed ? (
        <>
          <RiDeleteBinFill />
          Showing removed
        </>
      ) : (
        <RiDeleteBinLine />
      )}
    </Toggle>
  );
}

export { ResourceListTrashFilter };
