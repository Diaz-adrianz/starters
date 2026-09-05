import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError(error, query) {
      if (query.meta?.silent) return;
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message ?? 'Something went wrong');
    },
  }),
  mutationCache: new MutationCache({
    onError(error, _variables, _onMutateResult, mutation) {
      if (mutation.meta?.silent) return;
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message ?? 'Something went wrong');
    },
  }),
});

export { queryClient };
