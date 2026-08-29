import { QueryClient } from '@tanstack/react-query';
import { captureError } from '../errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
      retry: 2,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false, // Mobile friendly
    },
    mutations: {
      onError: (error) => {
        captureError(error, { source: 'QueryClient', action: 'mutation' });
      },
    },
  },
});
