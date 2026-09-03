import { queryClient } from '@/lib/react-query/query.client';
import { QueryClientProvider } from '@tanstack/react-query';

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
