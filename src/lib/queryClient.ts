import { QueryClient } from '@tanstack/react-query';

/**
 * Cliente global do TanStack Query, alinhado ao padrão do Dashboard:
 * cache longo (5 min fresco / 30 min em GC), sem refetch em foco
 * e uma única tentativa de retry por query.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
