import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { buttonVariants } from '@/components/ui/button';
import { type RemixiconComponentType } from '@remixicon/react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type ConfirmOptions = {
  Icon?: RemixiconComponentType;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
};

type Confirm = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((opts = {}) => {
    resolver.current?.(false);
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpen(false);
  };

  const {
    Icon,
    title = 'Are you sure?',
    description,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    confirmVariant,
    cancelVariant,
  } = options;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={(o) => !o && settle(false)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            {Icon && (
              <AlertDialogMedia
                className={cn(
                  confirmVariant === 'destructive' ||
                    cancelVariant === 'destructive'
                    ? 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
                    : ''
                )}
              >
                <Icon />
              </AlertDialogMedia>
            )}

            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant={cancelVariant}
              onClick={() => settle(false)}
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmVariant}
              onClick={() => settle(true)}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

function useConfirm(): Confirm {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm needs ConfirmProvider');
  return ctx;
}

export { ConfirmProvider, useConfirm };
