import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — categories don't change often
      gcTime:    1000 * 60 * 10,  // 10 min cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;