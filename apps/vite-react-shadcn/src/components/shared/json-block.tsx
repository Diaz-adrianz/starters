import { cn } from 'cn';

function JsonBlock({
  value,
  className = '',
}: {
  value: unknown;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        'max-h-96 w-full min-w-0 scrollbar-none overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs leading-relaxed text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
        className
      )}
    >
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  );
}

export { JsonBlock };
