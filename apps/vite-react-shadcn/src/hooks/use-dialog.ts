import { useCallback, useState } from 'react';

type ShowArgs<T> = [T] extends [undefined | void] ? [] : [payload: T];

type DialogState<T = undefined> = {
  payload: T | undefined;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  show: (...args: ShowArgs<T>) => void;
  hide: () => void;
};

function useDialogState<T = undefined>(): DialogState<T> {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<T | undefined>(undefined);

  const show = useCallback((...args: ShowArgs<T>) => {
    setPayload(args[0] as T | undefined);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setPayload(undefined);
  }, []);

  return { open, onOpenChange, payload, show, hide };
}

export { useDialogState };
export type { DialogState };
